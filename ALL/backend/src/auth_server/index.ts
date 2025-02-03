// -*- coding: utf-8 -*-

import dotenv from "dotenv";
dotenv.config();

import express, {
    Request,
    Response,
    NextFunction,
    Errback,
} from "express";
import session from "express-session";
import CookieParser from "cookie-parser";
import RedisStore from "connect-redis";
import helmet from "helmet";
import cors from "cors";
import * as OpenApiValidator from 'express-openapi-validator';
import PinoHttp from "pino-http";
import Config from "config";

import RedisConnection from "../redis";
import { initAppDataSource } from "../data-source";
import { CommonMiddleware } from "../common/middleware";
import { setRouters } from "./router/define";

import { logger } from "./logger";

RedisConnection.init(logger);
initAppDataSource(logger);

const app = express();

app.set("trust proxy", 1);
app.set("etag", false);

app.use(CommonMiddleware.setAccessDate);
app.use(CommonMiddleware.setRequestId);
app.use(CommonMiddleware.setNoStore);

app.use(helmet());
app.use(express.json());

const corsConfig = Config.get("authServer.cors.config") as cors.CorsOptions;
app.use(cors(corsConfig));

app.use(PinoHttp({
    //logger: logger,
    genReqId: (req: Request, res: Response) => {
        return res.locals.requestId;
    },
    customLogLevel: (req: Request, res: Response) => {
        if (!res.statusCode) {
            return "error";
        }
        else if (res.statusCode >= 400 && res.statusCode < 500) {
            return "warn";
        }
        else if (res.statusCode >= 500) {
            return "error";
        }
        else if (res.statusCode >= 300 && res.statusCode < 400) {
            return "silent";
        }
        return "info";
    },
    quietReqLogger: true,
}));

const sessionConfig = Config.get("authServer.loginSession") as any; // とりあえず
const sessionSecret = process.env.RL_AUTHSERVER_SESSION_SECRET;
if (!sessionSecret) {
    logger.error("環境変数 RL_AUTHSERVER_SESSION_SECRET が定義されていません");
    process.exit(1);
}
app.use(session({
    secret: sessionSecret,
    name: sessionConfig.name,
    cookie: {
        httpOnly: sessionConfig.cookie.httpOnly,
        sameSite: sessionConfig.cookie.sameSite,
        secure: sessionConfig.cookie.secure,
    },
    resave: sessionConfig.resave,
    saveUninitialized: sessionConfig.saveUninitialized,
    // @ts-ignore
    store: new RedisStore({
        // @ts-ignore
        client: RedisConnection.getConnection("loginSession"),
        prefix: sessionConfig.redis.prefix,
    })
}));
app.use(CookieParser(sessionSecret));

app.use(
    OpenApiValidator.middleware({
        apiSpec: "spec/api/auth.yaml", // TODO: 外に出す
        validateRequests: true,
        validateResponses: true,
    }),
);

setRouters(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.listen(Config.get("authServer.httpd.port"));
