// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import Config from "config";

import RedisConnection from "../../redis";

import { UserHaveEfo } from "../../entity/user_have_efo";

export type UserHaveTotalEfoType = {
    haveEfo: number,
    totalAddEfo: number,
    totalConsumeEfo: number,
}

export class CommonGetUserHaveEfoHandler {
    readonly userId: string;

    constructor(
        userId: string,
    ) {
        this.userId = userId;
    }

    public async getUserHaveTotalEfo(manager: EntityManager, now: Date) {
        const cachedUserHaveTotalEfo = await this.getUserHaveTotalEfoInRedis();
        if (cachedUserHaveTotalEfo) {
            return JSON.parse(cachedUserHaveTotalEfo) as UserHaveTotalEfoType;
        }

        const userHaveTotalEfo = await this.getUserHaveTotalEfoInDB(manager, now);
        await this.setUserHaveTotalEfoInRedis(userHaveTotalEfo);
        return userHaveTotalEfo;
    }

    private async getUserHaveTotalEfoInRedis() {
        const redis = CommonGetUserHaveEfoHandler.getRedis();
        const key = CommonGetUserHaveEfoHandler.getCacheKey(this.userId);
        return redis.get(key);
    }

    private async setUserHaveTotalEfoInRedis(obj: UserHaveTotalEfoType) {
        const redis = CommonGetUserHaveEfoHandler.getRedis();
        const key = CommonGetUserHaveEfoHandler.getCacheKey(this.userId);
        const expireSec = this.getCacheExpireSec();
        return redis.setex(key, expireSec, JSON.stringify(obj));
    }

    private getCacheExpireSec() {
        // TODO: 有効期限ありのものを考慮する
        return Config.get("epo.userTotalHave.cache.expireSec") as number;
    }

    public static getCacheKey(userId: string) {
        return Config.get("epo.userTotalHave.cache.key.prefix") as string + userId;
    }

    public static getRedis() {
        return RedisConnection.getConnection("dataCache");
    }

    public static clearCache(userId: string) {
        const redis = CommonGetUserHaveEfoHandler.getRedis();
        const key = CommonGetUserHaveEfoHandler.getCacheKey(userId);
        return redis.del(key);
    }

    public async getUserHaveTotalEfoInDB(manager: EntityManager, now: Date) {
        const currentEfo = await this.getUserCurrentHaveEfoInDb(manager, now);
        const [totalAddEfo, totalConsumeEfo] = await this.getUserTotalEfoInDb(manager);
        const response: UserHaveTotalEfoType = {
            haveEfo: currentEfo,
            totalAddEfo: totalAddEfo,
            totalConsumeEfo: totalConsumeEfo,
        }
        return response;
    }

    private async getUserCurrentHaveEfoInDb(manager: EntityManager, now: Date) {
        const query = manager
            .createQueryBuilder(UserHaveEfo, "uhe")
            .select("sum(uhe.haveEfo) as haveEfo, sum(uhe.totalAddEfo) as totalAddEfo, sum(uhe.totalConsumeEfo) as totalConsumeEfo")
            .where("uhe.userId = :userId")
            .andWhere("uhe.expireDate > :now")
            .setParameters({
                userId: this.userId,
                now: now,
            });
        const currentEfo = await query.getRawOne();
        return currentEfo.haveEfo ? parseInt(currentEfo.haveEfo, 10) : 0;
    }

    private async getUserTotalEfoInDb(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserHaveEfo, "uhe")
            .select("sum(uhe.totalAddEfo) as addEfo, sum(uhe.totalConsumeEfo) as consumeEfo")
            .where("uhe.userId = :userId")
            .setParameters({
                userId: this.userId,
            });
        const totalEfos = await query.getRawOne();
        let totalAddEfo = 0;
        let totalConsumeEfo = 0;
        if (totalEfos) {
            if (totalEfos.addEfo) {
                totalAddEfo = parseInt(totalEfos.addEfo, 10);
            }
            if (totalEfos.consumeEfo) {
                totalConsumeEfo = parseInt(totalEfos.consumeEfo, 10);
            }
        }
        return [totalAddEfo, totalConsumeEfo];
    }

    public static getUserHaveTotalEfo(manager: EntityManager, userId: string, now: Date) {
        const ins = new CommonGetUserHaveEfoHandler(userId);
        return ins.getUserHaveTotalEfo(manager, now);
    }
}
