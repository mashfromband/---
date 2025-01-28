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

export type ForgetPasswordRegist = {
    userId: string,
    mailAddress: string,
}

export class MailAuthForgetPasswordToken {
    readonly token: string;

    constructor(token: string) {
        this.token = token;
    }

    public userId: string | undefined;
    public mailAddress: string | undefined;
    public now: Date = new Date();
    public expireAt: number = 0;

    public async save() {
        if (this.userId === undefined || this.mailAddress === undefined || this.expireAt === undefined) {
            throw new Error("ユーザーIDかメールアドレスか有効期限が設定されていない");
        }

        const config: RedisConfig = Config.get("authServer.forgetPassword.redis");
        const key = this.getKey(config);
        const redis = this.getRedis(config);
        await redis.pipeline()
            .set(key, JSON.stringify(this.createSaveObj()))
            .expireat(key, this.expireAt)
            .exec();
    }

    public async load() {
        const config: RedisConfig = Config.get("authServer.forgetPassword.redis");
        const key = this.getKey(config);
        const redis = this.getRedis(config);
        const value = await redis.get(key);
        if (value === null) {
            return false;
        }
        const obj = JSON.parse(value);
        this.userId = obj.userId;
        this.mailAddress = obj.mailAddress;
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

    private createSaveObj(): ForgetPasswordRegist {
        if (this.userId === undefined || this.mailAddress === undefined) {
            throw new Error("ユーザーIDかメールアドレスが設定されていない");
        }
        return {
            userId: this.userId,
            mailAddress: this.mailAddress,
        };
    }

    private static getExpireAt(now: Date) {
        const expireSec: number = Config.get("authServer.forgetPassword.token.expireSec");
        return moment(now).add(expireSec, "second").unix();
    }

    private getKey(config: RedisConfig): string {
        return config.key.prefix + this.token;
    }

    public async clear() {
        const config: RedisConfig = Config.get("authServer.forgetPassword.redis");
        const key = this.getKey(config);
        const redis = this.getRedis(config);
        return redis.del(this.getKey(config));
    }

    public static async createToken(now: Date) {
        const tokenByte: number = Config.get("authServer.forgetPassword.token.byte");
        const token = await Secrets.getTokenUrlBase64(tokenByte);
        const ins = new MailAuthForgetPasswordToken(token);
        ins.expireAt = this.getExpireAt(now);
        return ins;
    }
}
