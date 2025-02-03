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
import { genreRouters } from "./genre";
import { categoryRouters } from "./category";
import { questRouters } from "./quest";
import { userRouters } from "./user";
import { recruitCompanyRouters } from "./recruit_company";
import { wantedAdsRouters } from "./wanted_ads";
import { officialNewsRouters } from "./official_news";
import { userIconRouters } from "./user_icon";
import { tagRouters } from "./tag";
import { realEfoRouters } from "./real-efo";
import { contactRouters } from "./contact";

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
    genreRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    categoryRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    questRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    userRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    recruitCompanyRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    wantedAdsRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    officialNewsRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    userIconRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    tagRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    realEfoRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    contactRouters.forEach((config: RouterConfigType) => {
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
                authenticateAccessToken,
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
