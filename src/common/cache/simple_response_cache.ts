// -*- coding: utf-8 -*-

import Config from "config";

import RedisConnection from "../../redis";

export class SimpleResponseCache {

    readonly key: string;
    readonly id: string;

    constructor(key: string, id: string) {
        this.key = key;
        this.id = id;
    }

    public static getRedis() {
        return RedisConnection.getConnection("responseCache");
    }

    public async load() {
        const redis = SimpleResponseCache.getRedis();
        const obj = await redis.hget(this.key, this.id);
        if (!obj) {
            return null;
        }
        return JSON.parse(obj);
    }

    public async save(response: any) {
        const redis = SimpleResponseCache.getRedis();
        const expireSec = Config.get("simpleResponseCache.expireSec") as number;
        await redis.hset(this.key, this.id, JSON.stringify(response));
        await redis.expire(this.key, expireSec);
    }

    public async delete() {
        const redis = SimpleResponseCache.getRedis();
        return redis.hdel(this.key, this.id);
    }

    public static async oneDelete(key: string, id: string) {
        const redis = SimpleResponseCache.getRedis();
        return redis.hdel(key, id);
    }
    public static async allDelete(key: string) {
        const redis = SimpleResponseCache.getRedis();
        return redis.del(key);
    }
}
