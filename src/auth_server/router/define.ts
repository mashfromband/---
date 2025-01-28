// -*- coding: utf-8 -*-

import express, {
    Request,
    Response,
    NextFunction,
} from "express";

import {
    asyncWrapper,
    authenticateAccessToken,
} from "../middleware";

import { helloRouters } from "./hello";
import { authRouters } from "./auth";
import { adminAuthRouters } from "./admin_auth";

export type RouterConfigType = {
    path: string,
    method: string,
    class: any, // とりあえず
    callFunctionName: string,
    allowNoAuccessToken?: boolean,
};

export const setRouters = (app: express.Express) => {
    helloRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    authRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    adminAuthRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
}

const setRouter = (app: express.Express, config: RouterConfigType) => {
    const setConfig = (req: Request, res: Response, next: NextFunction) => {
        res.locals.config = config;
        next();
    }

    switch(config.method) {
        case "GET": {
            app.get(
                config.path,
                setConfig,
                authenticateAccessToken,
                asyncWrapper(async(req: Request, res: Response, next: NextFunction) => {
                    const ins = new config.class(req, res, next, config);
                    return await ins[config.callFunctionName]();
                })
            );
            break;
        }

        case "POST": {
            app.post(
                config.path,
                setConfig,
                authenticateAccessToken,
                asyncWrapper(async(req: Request, res: Response, next: NextFunction) => {
                    const ins = new config.class(req, res, next, config);
                    return await ins[config.callFunctionName]();
                })
            );
            break;
        }

        case "PUT": {
            app.put(
                config.path,
                setConfig,
                authenticateAccessToken,
                asyncWrapper(async(req: Request, res: Response, next: NextFunction) => {
                    const ins = new config.class(req, res, next, config);
                    return await ins[config.callFunctionName]();
                })
            );
            break;
        }

        case "DELETE": {
            app.delete(
                config.path,
                setConfig,
                authenticateAccessToken,
                asyncWrapper(async(req: Request, res: Response, next: NextFunction) => {
                    const ins = new config.class(req, res, next, config);
                    return await ins[config.callFunctionName]();
                })
            );
            break;
        }

        case "OPTIONS": {
            app.options(
                config.path,
                setConfig,
                (req: Request, res: Response, next: NextFunction) => {
                    res.sendStatus(204);
                }
            );
            break;
        }

        default: {
            throw Error("not support method: " + config.method);
        }
    }
}
