// -*- coding: utf-8 -*-

import dotenv from "dotenv";
dotenv.config();

import express, {
    Request,
    Response,
    NextFunction,
} from "express";
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
app.use(express.urlencoded());

const corsConfig = Config.get("adminApiServer.cors.config") as cors.CorsOptions;
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

app.use(
    OpenApiValidator.middleware({
        apiSpec: "spec/api/management.yaml", // TODO: 外に出す
        validateRequests: true,
        //validateResponses: true,
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

app.listen(Config.get("adminApiServer.httpd.port"));
