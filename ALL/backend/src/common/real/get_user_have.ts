// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import Config from "config";

import RedisConnection from "../../redis";

import { UserHaveReal } from "../../entity/user_have_real";

export type UserHaveTotalRealType = {
    haveReal: number,
    totalAddReal: number,
    totalConsumeReal: number,
}

export class CommonGetUserHaveRealHandler {
    readonly userId: string;

    constructor(
        userId: string,
    ) {
        this.userId = userId;
    }

    public async getUserHaveTotalReal(manager: EntityManager, now: Date) {
        const cachedUserHaveTotalReal = await this.getUserHaveTotalRealInRedis();
        if (cachedUserHaveTotalReal) {
            return JSON.parse(cachedUserHaveTotalReal) as UserHaveTotalRealType;
        }

        const userHaveTotalReal = await this.getUserHaveTotalRealInDB(manager, now);
        await this.setUserHaveTotalRealInRedis(userHaveTotalReal);
        return userHaveTotalReal;
    }

    private async getUserHaveTotalRealInRedis() {
        const redis = CommonGetUserHaveRealHandler.getRedis();
        const key = CommonGetUserHaveRealHandler.getCacheKey(this.userId);
        return redis.get(key);
    }

    private async setUserHaveTotalRealInRedis(obj: UserHaveTotalRealType) {
        const redis = CommonGetUserHaveRealHandler.getRedis();
        const key = CommonGetUserHaveRealHandler.getCacheKey(this.userId);
        const expireSec = this.getCacheExpireSec();
        return redis.setex(key, expireSec, JSON.stringify(obj));
    }

    private getCacheExpireSec() {
        // TODO: 有効期限ありのものを考慮する
        return Config.get("real.userTotalHave.cache.expireSec") as number;
    }

    public static getCacheKey(userId: string) {
        return Config.get("real.userTotalHave.cache.key.prefix") as string + userId;
    }

    public static getRedis() {
        return RedisConnection.getConnection("dataCache");
    }

    public static clearCache(userId: string) {
        const redis = CommonGetUserHaveRealHandler.getRedis();
        const key = CommonGetUserHaveRealHandler.getCacheKey(userId);
        return redis.del(key);
    }

    public async getUserHaveTotalRealInDB(manager: EntityManager, now: Date) {
        const currentReal = await this.getUserCurrentHaveRealInDb(manager, now);
        const [totalAddReal, totalConsumeReal] = await this.getUserTotalRealInDb(manager);
        const response: UserHaveTotalRealType = {
            haveReal: currentReal,
            totalAddReal: totalAddReal,
            totalConsumeReal: totalConsumeReal,
        }
        return response;
    }

    private async getUserCurrentHaveRealInDb(manager: EntityManager, now: Date) {
        const query = manager
            .createQueryBuilder(UserHaveReal, "uhr")
            .select("sum(uhr.haveReal) as currentReal")
            .where("uhr.userId = :userId")
            .andWhere("uhr.expireDate > :now")
            .setParameters({
                userId: this.userId,
                now: now,
            });
        const currentReal = await query.getRawOne();
        if (currentReal && currentReal.currentReal) {
            return parseInt(currentReal.currentReal, 10);
        }
        else {
            return 0;
        }
    }

    private async getUserTotalRealInDb(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserHaveReal, "uhr")
            .select("sum(uhr.totalAddReal) as totalAddReal, sum(uhr.totalConsumeReal) as totalConsumeReal")
            .where("uhr.userId = :userId")
            .setParameters({
                userId: this.userId,
            });
        const totalReals = await query.getRawOne();
        let totalAddReal = 0;
        let totalConsumeReal = 0;
        if (totalReals) {
            if (totalReals.totalAddReal) {
                totalAddReal = parseInt(totalReals.totalAddReal, 10);
            }
            if (totalReals.totalConsumeReal) {
                totalConsumeReal = parseInt(totalReals.totalConsumeReal, 10);
            }
        }
        return [totalAddReal, totalConsumeReal];
    }


    public static getUserHaveTotalReal(manager: EntityManager, userId: string, now: Date) {
        const ins = new CommonGetUserHaveRealHandler(userId);
        return ins.getUserHaveTotalReal(manager, now);
    }
}
