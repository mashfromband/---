// -*- coding: utf-8 -*-

import Redis from "ioredis";

import { Logger } from "pino";

import Config from "config";

export default class RedisConnection {
    private constructor() {
    }

    private static redisConnections: { [name: string]: Redis } = {};

    public static init(logger?: Logger) {
        const config = Config.get("redis");
        if (!config) {
            if (logger) {
                logger.error("[RedisStore] 設定ファイルに Redis の情報がありません。");
            }
            return false;
        }

        for (const name in config) {
            type ConfType = {
                db: number,
            };
            const conf = Config.get("redis." + name) as ConfType;
            const dbNumber = conf.db;
            this.connect(name, dbNumber, logger);
        }

        return true;
    }

    public static getConnection(name: string) {
        return this.redisConnections[name];
    }

    private static connect(name: string, dbNumber: number, logger?: Logger) {
        type RedisConfig = {
            host: string,
            port: number,
            username?: string,
            password?: string,
            db: number,
            tls?: any,
        };

        if (logger) {
            logger.info({connectionName: name, dbNumber: dbNumber}, "[RedisStore] Redis に接続します。");
        }

        const redisConfig: RedisConfig = {
            host: process.env.RL_REDIS_DEFAULT_HOST as string,
            port: parseInt(process.env.RL_REDIS_DEFAULT_PORT as string),
            db: dbNumber,
        };
        if (Config.get("redis.useAuth")) {
            redisConfig.username = process.env.RL_REDIS_DEFAULT_USERNAME as string;
            redisConfig.password = process.env.RL_REDIS_DEFAULT_PASSWORD as string;
        }
        if (Config.get("redis.useTls")) {
            redisConfig.tls = {};
        }

        const redisConnction = new Redis(redisConfig);
        if (this.redisConnections[name] !== undefined) {
            // 万が一、古い接続があったら一旦切断する
            this.redisConnections[name].disconnect(false);
            if (logger) {
                logger.warn({connectionName: name, dbNumber: dbNumber}, "[RedisStore] 既存の Redis への接続を切断しました。");
            }
        }
        this.redisConnections[name] = redisConnction;
        if (logger) {
            logger.info({connectionName: name, dbNumber: dbNumber}, "[RedisStore] Redis に接続成功しました。");
        }
    }

    public static close(name: string, logger?: Logger, reconnect = false) {
        if (!this.redisConnections[name]) {
            if (logger) {
                logger.warn({connectionName: name}, "[RedisStore] Redis への接続が存在しません。");
            }
            return false;
        }
        this.redisConnections[name].disconnect(reconnect);
        if (logger) {
            logger.info({connectionName: name}, "[RedisStore] Redis を切断しました。");
        }
        return true;
    }

    public static allClose(logger?: Logger) {
        if (logger) {
            logger.info("[RedisStore] Redis の全接続を切断します。");
        }
        for (const name in this.redisConnections) {
            this.close(name, logger);
        }
        if (logger) {
            logger.info("[RedisStore] Redis の全全接続を切断しました。");
        }
    }

}
