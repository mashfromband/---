// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import moment from "moment";
import { Logger } from "pino";
import Config from "config";

import RedisConnection from "../../redis";

import { RealEfoRate } from "../../entity/real_efo_rate";

export type RateInfoType = {
    default: {
        id: string,
        rate: number,
    },
    limitRate?: {
        id: string,
        rate: number,
        beginAt: number,
        endAt: number,
    },
}

export class CommonRealEfoRateHandler {
    readonly logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public async getRate(manager: EntityManager, now: Date) {
        const cachedRateInfo = await this.getRateInRedis(now);
        if (cachedRateInfo) {
            return cachedRateInfo;
        }

        const rates = await this.getRateInDb(manager, now);
        const rateInfo = this.createRateInfo(rates.default!, rates.valid);

        await this.setRateInRedis(rateInfo);
        return rateInfo;
    }

    private async setRateInRedis(rateInfo: RateInfoType) {
        const redis = CommonRealEfoRateHandler.getRedis();
        const key = CommonRealEfoRateHandler.getCacheKey();
        const expireSec = CommonRealEfoRateHandler.getExpireSec();
        return redis.setex(key, expireSec, JSON.stringify(rateInfo));
    }

    private async getRateInRedis(now: Date) {
        const redis = CommonRealEfoRateHandler.getRedis();
        const key = CommonRealEfoRateHandler.getCacheKey();
        const cachedRateInfoJson = await redis.get(key);
        if (!cachedRateInfoJson) {
            return null;
        }

        const cachedRateInfo = JSON.parse(cachedRateInfoJson) as RateInfoType;
        if (!cachedRateInfo.limitRate) {
            return cachedRateInfo;
        }

        if (cachedRateInfo.limitRate.endAt > moment(now).unix()) {
            await CommonRealEfoRateHandler.clearCache();
            return null;
        }

        return cachedRateInfo;
    }

    public async getRateInDb(manager: EntityManager, now: Date) {
        const query = manager
            .createQueryBuilder(RealEfoRate, "rate")
            .where("rate.isDefaultRate = :isDefaultRate")
            .orWhere("rate.periodBeginAt <= :now and rate.periodEndAt > :now")
            .orderBy("rate.periodEndAt", "ASC")
            .setParameters({
                isDefaultRate: true,
                now: now,
            });
        const rates = await query.getMany();
        if (rates.length === 0) {
            this.logger.error({}, "not exist rate-efo rate!");
            throw(new Error("not exist rate-efo rate!"));
        }

        const rate = this.getRateDefaultAndValidPeriod(rates);
        if (!rate.default && !rate.valid) {
            this.logger.error({}, "not exist valid rate-efo rate!");
            throw(new Error("not exist valid rate-efo rate!"));
        }

        return rate;
    }

    private createRateInfo(defaultRate: RealEfoRate, validRate: RealEfoRate | undefined) {
        const rateInfo: RateInfoType = {
            default: {
                id: defaultRate.id,
                rate: defaultRate.oneRealToEfo,
            },
        };
        if (validRate) {
            rateInfo.limitRate = {
                id: validRate.id,
                rate: validRate.oneRealToEfo,
                beginAt: moment(validRate.periodBeginAt).unix(),
                endAt: moment(validRate.periodEndAt).unix(),
            };
        }
        return rateInfo;
    }

    private getRateDefaultAndValidPeriod(rates: RealEfoRate[]) {
        let defaultRate: RealEfoRate | undefined;
        let validRate: RealEfoRate | undefined;

        for (const rate of rates) {
            if (rate.isDefaultRate) {
                defaultRate = rate;
            }
            else {
                validRate = rate;
                break;
            }
        }

        return {
            default: defaultRate,
            valid: validRate,
        }
    }

    public static getCacheKey() {
        return Config.get("real.rate.cache.key") as string;
    }

    public static getRedis() {
        return RedisConnection.getConnection("dataCache");
    }

    public static getExpireSec() {
        return Config.get("real.rate.cache.expireSec") as number;
    }

    public static async clearCache() {
        const redis = this.getRedis();
        const key = this.getCacheKey();
        return redis.del(key);
    }

    public static async getCurrentRate(logger: Logger, manager: EntityManager, now: Date) {
        const ins = new CommonRealEfoRateHandler(logger);
        const rates = await ins.getRateInDb(manager, now);
        const rate = rates.valid ? rates.valid : rates.default;
        if (!rate) {
            logger.error({}, "not exist valid rate-efo rate!");
            throw(new Error("not exist valid rate-efo rate!"));
        }
        return rate;
    }
}
