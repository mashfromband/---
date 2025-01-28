// -*- coding: utf-8 -*-

import moment from "moment";
import { EntityManager } from "typeorm";
import { Logger } from "pino";

import Config from "config";

import { User } from "../../entity/user";
import { UserHaveEfo } from "../../entity/user_have_efo";
import { UserEfoHistory } from "../../entity/user_efo_history";

import type {
    EfoType,
} from "../../entity/user_have_efo";
import type {
    ReasonType,
 } from "../../entity/user_efo_history";

export class CommonAddUserHaveEfoHandler {
    readonly logger: Logger;
    readonly user: User;
    public addEfo: number;
    public efoType: EfoType;
    public reason: ReasonType;
    public expireDate: Date;

    constructor(logger: Logger, user: User, addEfo: number, efoType: EfoType, reason: ReasonType, expireDate?: Date) {
        this.logger = logger;
        this.user = user;
        this.addEfo = addEfo;
        this.efoType = efoType;
        this.reason = reason;
        if (expireDate) {
            this.expireDate = expireDate;
        }
        else {
            const doomsday = Config.get("system.doomsday") as string;
            this.expireDate = moment(doomsday).toDate();
        }
    }

    private async getUserHaveEfoWithLock(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserHaveEfo, "uhe")
            .where("uhe.userId = :userId and uhe.efoType = :efoType and uhe.expireDate = :expireDate")
            .setParameters({
                userId: this.user.id,
                efoType: this.efoType,
                expireDate: this.expireDate,
            })
            .setLock("pessimistic_write");
        return query.getOne();
    }

    public async add(manager: EntityManager) {
        let userHaveEfo = await this.getUserHaveEfoWithLock(manager);
        if (!userHaveEfo) {
            userHaveEfo = new UserHaveEfo(this.user, this.efoType, this.expireDate);
        }

        userHaveEfo.haveEfo += this.addEfo;
        userHaveEfo.totalAddEfo += this.addEfo;
        const newUserHaveEfo = await manager.save(userHaveEfo);

        const userEfoHistory = new UserEfoHistory(
            this.user,
            this.reason,
        );
        userEfoHistory.modifyEfo = this.addEfo;
        const newUserEfoHistory = await manager.save(userEfoHistory);

        const log = {
            userId: this.user.id,
            reason: this.reason,
            addEfo: this.addEfo,
            efoType: this.efoType,
            transactionId: newUserEfoHistory.transactionId,
            userHaveEfoId: newUserHaveEfo.id,
            userEfoHistoryId: newUserEfoHistory.id,
        };
        this.logger.info(log, "add EFO");

        return {
            userHaveEfo: newUserHaveEfo,
            userEfoHistory: newUserEfoHistory,
        };
    }

    public static async addByQuestClear(
        logger: Logger,
        manager: EntityManager,
        user: User,
        addEfo: number,
    ) {
        const userHaveEfo = new CommonAddUserHaveEfoHandler(logger, user, addEfo, "questClear", "questClear");
        return userHaveEfo.add(manager);
    }
}
