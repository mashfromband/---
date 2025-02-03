import Config from "config";
import moment from "moment";

import { Secrets } from "../../../../../utils/secrets";
import RedisConnection from "../../../../../redis";

type RedisConfig = {
    dbName: string,
    key: {
        prefix: string,
    },
}

export type TempMailRegistStatus = "before" | "inProcess" | "finished";
export type TempMailRegist = {
    mailAddress: string,
    status: TempMailRegistStatus,
}

export class MailAuthLoginRegistToken {
    readonly token: string;

    constructor(token: string) {
        this.token = token;
    }

    public mailAddress: string | undefined;
    public status: TempMailRegistStatus = "before";
    public now: Date = new Date();
    public expireAt: number = 0;

    public async save() {
        if (this.mailAddress === undefined || this.expireAt === undefined) {
            throw new Error("メールアドレスか有効期限が設定されていない");
        }

        const config: RedisConfig = Config.get("authServer.userRegist.redis");
        const key = this.getKey(config);
        const redis = this.getRedis(config);
        await redis.pipeline()
            .set(key, JSON.stringify(this.createSaveObj()))
            .expireat(key, this.expireAt)
            .exec();
    }

    public async load() {
        const config: RedisConfig = Config.get("authServer.userRegist.redis");
        const key = this.getKey(config);
        const redis = this.getRedis(config);
        const value = await redis.get(key);
        if (value === null) {
            return false;
        }
        const obj = JSON.parse(value);
        this.mailAddress = obj.mailAddress;
        this.status = obj.status;
        return true;
    }

    public setExpireDate(expire: Date | number) {
        if (expire instanceof Date) {
            this.expireAt = moment(expire).unix();
        }
        else {
            this.expireAt = expire;
        }
    }
    private getRedis(config: RedisConfig) {
        return RedisConnection.getConnection(config.dbName);
    }

    private createSaveObj(): TempMailRegist {
        if (this.mailAddress === undefined) {
            throw new Error("メールアドレスが設定されていない");
        }
        return {
            mailAddress: this.mailAddress,
            status: this.status,
        };
    }

    private static getExpireAt(now: Date) {
        const expireSec: number = Config.get("authServer.userRegist.token.expireSec");
        return moment(now).add(expireSec, "second").unix();
    }

    private getKey(config: RedisConfig): string {
        return  config.key.prefix + this.token;
    }

    public static async createRegistToken(status: TempMailRegistStatus, now: Date) {
        const tokenByte: number = Config.get("authServer.userRegist.token.byte");
        const token = await Secrets.getTokenUrlBase64(tokenByte);
        const ins = new MailAuthLoginRegistToken(token);
        ins.status = status;
        ins.expireAt = this.getExpireAt(now);
        return ins;
    }
}
