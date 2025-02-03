// -*- coding: utf-8 -*-

import moment from "moment";
import { EntityManager } from "typeorm";
import { Logger } from "pino";

import Config from "config";

import { User } from "../../entity/user";
import { UserHaveReal } from "../../entity/user_have_real";
import { UserRealHistory } from "../../entity/user_real_history";
import { RealEfoRate } from "../../entity/real_efo_rate";

import type { RealType } from "../../entity/user_have_real";
import type { RealReasonType } from "../../entity/user_real_history";

export class CommonAddUserHaveRealHandler {
    readonly logger: Logger;
    readonly user: User;
    public addReal: number;
    public realType: RealType;
    public reason: RealReasonType;
    public adaptedExchangeRate: RealEfoRate | null = null;
    public incomingTransactionId: string | null = null;
    public expireDate: Date;

    constructor(
        logger: Logger, user: User, addReal: number, realType: RealType, reason: RealReasonType,
        adaptedExchangeRate: RealEfoRate | null, incomingTransactionId: string | null,
        expireDate: Date | null | undefined,
    ) {
        this.logger = logger;
        this.user = user;
        this.addReal = addReal;
        this.realType = realType;
        this.reason = reason;
        this.adaptedExchangeRate = adaptedExchangeRate;
        this.incomingTransactionId = incomingTransactionId;
        if (expireDate) {
            this.expireDate = expireDate;
        }
        else {
            const doomsday = Config.get("system.doomsday") as string;
            this.expireDate = moment(doomsday).toDate();
        }
    }

    private async getUserHaveRealWithLock(manager: EntityManager, now: Date) {
        const query = manager
            .createQueryBuilder(UserHaveReal, "uhr")
            .where("uhr.userId = :userId and uhr.realType = :realType and uhr.expireDate > :now")
            .setParameters({
                userId: this.user.id,
                realType: this.realType,
                now: now,
            })
            .setLock("pessimistic_write");
        return query.getOne();
    }

    public async add(manager: EntityManager, now: Date) {
        let userHaveReal = await this.getUserHaveRealWithLock(manager, now);
        if (!userHaveReal) {
            userHaveReal = new UserHaveReal(this.user, this.realType, this.expireDate);
        }
        userHaveReal.haveReal += this.addReal;
        userHaveReal.totalAddReal += this.addReal;
        userHaveReal.incomingTransactionId = this.incomingTransactionId;
        const newUserHaveReal = await manager.save(userHaveReal);

        const userRealHistory = new UserRealHistory(
            this.user, this.reason, this.adaptedExchangeRate,
        );
        userRealHistory.modifyReal = this.addReal;
        userRealHistory.incomingTransactionId = this.incomingTransactionId;
        const newUserRealHistory = await manager.save(userRealHistory);

        const log = {
            userHaveRealId: newUserHaveReal.id,
            userRealHistoryId: newUserRealHistory.id,
            userRealHistoryIutgoingId: newUserRealHistory.outgoingId,
            userId: this.user.id,
            reason: this.reason,
            addReal: this.addReal,
            realType: this.realType,
            haveReal: newUserHaveReal.haveReal,
            incomingTransactionId: this.incomingTransactionId,
            adaptedExchangeRateId: this.adaptedExchangeRate ? this.adaptedExchangeRate.id : null,
            expireDate: this.expireDate,
        };
        this.logger.info("add REAL", log);

        return {
            userHaveReal: newUserHaveReal,
            userRealHistory: newUserRealHistory,
        };
    }

    public static async exchangeEfoToReal(
        manager: EntityManager,
        logger: Logger, user: User, addReal: number, realType: RealType, reason: RealReasonType,
        adaptedExchangeRate: RealEfoRate, incomingTransactionId: string, now: Date, expireDate?: Date,
    ) {
        const ins = new CommonAddUserHaveRealHandler(
            logger, user, addReal, "normal", "exchangeFromEfo",
            adaptedExchangeRate, incomingTransactionId, expireDate,
        );
        ins.realType = realType;
        ins.reason = reason;
        return ins.add(manager, now);
    }
}
