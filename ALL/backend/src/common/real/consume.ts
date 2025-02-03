// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import { Logger } from "pino";

import { User } from "../../entity/user";
import { UserRealHistory } from "../../entity/user_real_history";
import { UserHaveReal } from "../../entity/user_have_real";

import type { RealType } from "../../entity/user_real";
import type { RealReasonType } from "../../entity/user_real_history";
import { CommonGetUserHaveRealHandler } from "./get_user_have";

const allowReasons = ["exchangeToDigico"];
const priorityConsumeRealType: {[key: string]: RealType[]} = {
    exchangeToDigico: ["normal"],
};

export type RealConsumeOptionType = {
    digicoTradeId?: string,
}

export class CommonComsumeUserHaveRealHandler {
    readonly logger: Logger;
    readonly user: User;
    public consumeReal: number;
    public reason: RealReasonType;

    constructor(logger: Logger, user: User, consumeReal: number, reason: RealReasonType) {
        this.logger = logger;
        this.user = user;
        this.consumeReal = consumeReal;
        this.reason = reason;
    }

    public async consume(manager: EntityManager, now: Date, options?: RealConsumeOptionType) {
        if (!allowReasons.includes(this.reason)) {
            throw new Error("許可されていない reason です。 reason=" + this.reason);
        }

        const validUserHaveReals = await this.getValidUserHaveReals(manager, now, true);
        if (validUserHaveReals.length === 0) {
            const result = this.createFailResult(0, "保有REALが不足しています");
            this.logger.info("FAIL consume REAL", result);
            return result;
        }

        const targetUserHaveReals = this.getTargetUserHaveReals(validUserHaveReals);
        if (targetUserHaveReals.length === 0) {
            const result = this.createFailResult(0, "保有REALが不足しています");
            this.logger.info("FAIL consume REAL", result);
            return result;
        }

        const havingConsumeReal = this.getCanConsumeReal(targetUserHaveReals);
        if (havingConsumeReal < this.consumeReal) {
            const result= this.createFailResult(havingConsumeReal, "保有REALが不足しています");
            this.logger.info("FAIL consume REAL", result);
            return result;
        }

        let remainReal = this.consumeReal;
        let isFinish = false;
        for (const userHaveReal of targetUserHaveReals) {
            const canConsumeReal = userHaveReal.haveReal;
            if (canConsumeReal < remainReal) {
                userHaveReal.haveReal = 0;
                userHaveReal.totalConsumeReal += canConsumeReal;
                remainReal -= canConsumeReal;
                const log = this.createUserHaveRealConsumeLog(userHaveReal, remainReal, canConsumeReal, false);
                this.logger.info("consume REAL", log);
                continue;
            }
            else if (canConsumeReal === remainReal) {
                userHaveReal.haveReal = 0;
                userHaveReal.totalConsumeReal += canConsumeReal;
                remainReal -= canConsumeReal;
                isFinish = true;
                const log = this.createUserHaveRealConsumeLog(userHaveReal, 0, canConsumeReal, true);
                this.logger.info("consume REAL", log);
                break;
            }
            else {
                userHaveReal.haveReal -= remainReal;
                userHaveReal.totalConsumeReal += remainReal;
                const consumeReal = remainReal;
                remainReal = 0;
                isFinish = true;
                const log = this.createUserHaveRealConsumeLog(userHaveReal, remainReal, consumeReal, true);
                this.logger.info("consume REAL", log);
                break;
            }
        }

        if (!isFinish || remainReal > 0) {
            // こないはずだが...
            const result = this.createFailResult(havingConsumeReal, "保有REALが不足しています");
            this.logger.info("FAIL consume REAL", result);
            return result;
        }

        const allPromises = [];
        for (const userHaveReal of targetUserHaveReals) {
            allPromises.push(manager.save(userHaveReal));
        }

        const userRealHistory = new UserRealHistory(this.user, this.reason, null);
        userRealHistory.modifyReal = -this.consumeReal;
        if (options && options.digicoTradeId) {
            userRealHistory.digicoTradeId = options.digicoTradeId;
        }
        allPromises.push(manager.save(userRealHistory));

        await Promise.all(allPromises);
        await CommonGetUserHaveRealHandler.clearCache(this.user.id);

        const result = this.createSuccessResult(havingConsumeReal, this.consumeReal, "REAL消費成功");
        this.logger.info("SUCCESS consume REAL", result);

        return result;
    }

    private createUserHaveRealConsumeLog(userHaveReal: UserHaveReal, remainReal: number, consumeReal: number, isFinish: boolean) {
        return {
            userId: this.user.id,
            userHaveRealId: userHaveReal.id,
            remainReal: remainReal,
            consumeReal: consumeReal,
            isFinish: isFinish,
        }
    }

    private getCanConsumeReal(userHaveReals: UserHaveReal[]) {
        let canConsumeReal = 0;
        for (const userHaveReal of userHaveReals) {
            canConsumeReal += userHaveReal.haveReal;
        }
        return canConsumeReal;
    }

    private getTargetUserHaveReals(userHaveReals: UserHaveReal[]) {
        const typeOfUserHaveReals: {[key: string]: UserHaveReal[]} = {
            normal: [],
        };

        for (const userHaveReal of userHaveReals) {
            typeOfUserHaveReals[userHaveReal.realType].push(userHaveReal);
        }

        const priorities = priorityConsumeRealType[this.reason];

        const prioritiedTargetUserHaveReals: UserHaveReal[] = [];
        for (const realType of priorities) {
            for (const userHaveReal of typeOfUserHaveReals[realType]) {
                prioritiedTargetUserHaveReals.push(userHaveReal);
            }
        }

        return prioritiedTargetUserHaveReals;
    }

    private createSuccessResult(currentReal: number, consumeReal: number, message: string) {
        return {
            userId: this.user.id,
            currentReal: currentReal,
            hopeToConsumeReal: this.consumeReal,
            consumeReal: consumeReal,
            reason: this.reason,
            isSuccess: true,
            message: message,
        };
    }

    private createFailResult(currentReal: number, message: string) {
        return {
            userId: this.user.id,
            currentReal: currentReal,
            hopeToConsumeReal: this.consumeReal,
            consumeReal: 0,
            reason: this.reason,
            isSuccess: false,
            message: message,
        };
    }

    private async getValidUserHaveReals(manager: EntityManager, now: Date, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(UserHaveReal, "uhr")
            .where("uhr.userId = :userId")
            .andWhere("uhr.expireDate > :now")
            .setParameters({
                userId: this.user.id,
                now: now,
            })
            .orderBy("uhr.expireDate", "ASC");
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getMany();
    }
}
