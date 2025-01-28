// -*- coding: utf-8 -*-

import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { Logger } from "pino";
import Config from "config";

export const appDataSource = new DataSource({
    type: "mysql",
    host: process.env.RL_MYSQL_DEFAULT_HOST as string,
    port: parseInt(process.env.RL_MYSQL_DEFAULT_PORT as string),
    username: process.env.RL_MYSQL_DEFAULT_USER as string,
    password: process.env.RL_MYSQL_DEFAULT_PASSWORD as string,
    database: process.env.RL_MYSQL_DEFAULT_DATABASE as string,
    synchronize: false,
    logging: Config.get("typeOrm.enableLogging") as boolean,
    entities: [
        "dst/entity/*.js",
        "dst/entity/**/*.js",
    ],
    subscribers: [],
    migrations: [
        "dst/migration/*.js",
    ],
});

export const initAppDataSource = (logger: Logger) => {
    appDataSource.initialize()
        .then(() => {
            logger.info("[initAppDataSource] MySQL 接続成功。");
        })
        .catch((err) => {
            logger.fatal("[initAppDataSource] MySQL 接続失敗。", err);
            process.exit(1);
        });
};
