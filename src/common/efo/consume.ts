// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import { Logger } from "pino";

import { User } from "../../entity/user";
import { UserHaveEfo } from "../../entity/user_have_efo";
import { UserEfoHistory } from "../../entity/user_efo_history";

import type {
    EfoType,
} from "../../entity/user_have_efo";
import type {
    ReasonType,
} from "../../entity/user_efo_history";

const allowReasons = ["exchangeReal"];
const priorityConsumeEfoType: {[key: string]: EfoType[]} = {
    exchangeReal: ["free", "questClear"],
};

export class CommonComsumeUserHaveEfoHandler {
    readonly logger: Logger;
    readonly user: User;
    public consumeEfo: number;
    public reason: ReasonType;

    constructor(logger: Logger, user: User, consumeEfo: number, reason: ReasonType) {
        this.logger = logger;
        this.user = user;
        this.consumeEfo = consumeEfo;
        this.reason = reason;
    }

    public async consume(manager: EntityManager, now: Date) {
        if (!allowReasons.includes(this.reason)) {
            throw new Error("許可されていない reason です。 reason=" + this.reason);
        }

        const transactionId = UserEfoHistory.generateTransactionId();

        const validUserHaveEfos = await this.getValidUserHaveEfos(manager, now, true);
        if (validUserHaveEfos.length === 0) {
            const result = this.createFailResult(0, transactionId, "保有EFOが不足しています");
            this.logger.info("FAIL consume EFO", result);
            return result;
        }

        const targetUserHaveEfos = this.getTargetUserHaveEfos(validUserHaveEfos);
        if (targetUserHaveEfos.length === 0) {
            const result = this.createFailResult(0, transactionId, "保有EFOが不足しています");
            this.logger.info("FAIL consume EFO", result);
            return result;
        }

        const havingConsumeEfo = this.getCanConsumeEfo(targetUserHaveEfos);
        if (havingConsumeEfo < this.consumeEfo) {
            const result= this.createFailResult(havingConsumeEfo, transactionId, "保有EFOが不足しています");
            this.logger.info("FAIL consume EFO", result);
            return result;
        }

        let remainEfo = this.consumeEfo;
        let isFinish = false;
        for (const userHaveEfo of targetUserHaveEfos) {
            const canConsumeEfo = userHaveEfo.haveEfo;
            if (canConsumeEfo < remainEfo) {
                userHaveEfo.haveEfo = 0;
                userHaveEfo.totalConsumeEfo += canConsumeEfo;
                remainEfo -= canConsumeEfo;
                const log = this.createUserHaveEfoConsumeLog(userHaveEfo, remainEfo, canConsumeEfo, false);
                this.logger.info("consume EFO", log);
                continue;
            }
            else if (canConsumeEfo === remainEfo) {
                userHaveEfo.haveEfo = 0;
                userHaveEfo.totalConsumeEfo += canConsumeEfo;
                remainEfo -= canConsumeEfo;
                isFinish = true;
                const log = this.createUserHaveEfoConsumeLog(userHaveEfo, 0, canConsumeEfo, true);
                this.logger.info("consume EFO", log);
                break;
            }
            else {
                userHaveEfo.haveEfo -= remainEfo;
                userHaveEfo.totalConsumeEfo += remainEfo;
                const consumeEfo = remainEfo;
                remainEfo = 0;
                isFinish = true;
                const log = this.createUserHaveEfoConsumeLog(userHaveEfo, remainEfo, consumeEfo, true);
                this.logger.info("consume EFO", log);
                break;
            }
        }

        if (!isFinish || remainEfo > 0) {
            // こないはずだが...
            const result = this.createFailResult(havingConsumeEfo, transactionId, "保有EFOが不足しています");
            this.logger.info("FAIL consume EFO", result);
            return result;
        }

        const allPromises = [];
        for (const userHaveEfo of targetUserHaveEfos) {
            allPromises.push(manager.save(userHaveEfo));
        }

        const userEfoHistory = new UserEfoHistory(this.user, this.reason, transactionId);
        userEfoHistory.modifyEfo = -this.consumeEfo;
        allPromises.push(manager.save(userEfoHistory));

        await Promise.all(allPromises);

        const result = this.createSuccessResult(havingConsumeEfo, transactionId, this.consumeEfo, "EFO消費成功");
        this.logger.info("SUCCESS consume EFO", result);

        return result;
    }

    private createUserHaveEfoConsumeLog(userHaveEfo: UserHaveEfo, remainEfo: number, consumeEfo: number, isFinish: boolean) {
        return {
            userId: this.user.id,
            userHaveEfoId: userHaveEfo.id,
            remainEfo: remainEfo,
            consumeEfo: consumeEfo,
            isFinish: isFinish,
        }
    }

    private getCanConsumeEfo(userHaveEfos: UserHaveEfo[]) {
        let canConsumeEfo = 0;
        for (const userHaveEfo of userHaveEfos) {
            canConsumeEfo += userHaveEfo.haveEfo;
        }
        return canConsumeEfo;
    }

    private getTargetUserHaveEfos(userHaveEfos: UserHaveEfo[]) {
        const typeOfUserHaveEfos: {[key: string]: UserHaveEfo[]} = {
            free: [],
            questClear: [],
        };

        for (const userHaveEfo of userHaveEfos) {
            typeOfUserHaveEfos[userHaveEfo.efoType].push(userHaveEfo);
        }

        const priorities = priorityConsumeEfoType[this.reason];

        const prioritiedTargetUserHaveEfos: UserHaveEfo[] = [];
        for (const efoType of priorities) {
            for (const userHaveEfo of typeOfUserHaveEfos[efoType]) {
                prioritiedTargetUserHaveEfos.push(userHaveEfo);
            }
        }

        return prioritiedTargetUserHaveEfos;
    }

    private createSuccessResult(currentEfo: number, transactionId: string, consumeEfo: number, message: string) {
        return {
            transactionId: transactionId,
            userId: this.user.id,
            currentEfo: currentEfo,
            hopeToConsumeEfo: this.consumeEfo,
            consumeEfo: consumeEfo,
            reason: this.reason,
            isSuccess: true,
            message: message,
        };
    }

    private createFailResult(currentEfo: number, transactionId: string, message: string) {
        return {
            transactionId: transactionId,
            userId: this.user.id,
            currentEfo: currentEfo,
            hopeToConsumeEfo: this.consumeEfo,
            consumeEfo: 0,
            reason: this.reason,
            isSuccess: false,
            message: message,
        };
    }

    private async getValidUserHaveEfos(manager: EntityManager, now: Date, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(UserHaveEfo, "uhe")
            .where("uhe.userId = :userId")
            .andWhere("uhe.expireDate > :now")
            .setParameters({
                userId: this.user.id,
                now: now,
            })
            .orderBy("uhe.expireDate", "ASC");
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getMany();
    }
}
