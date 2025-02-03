// -*- coding: utf-8 -*-

import express, {
    Request,
    Response,
    NextFunction,
} from "express";
import { checkSchema } from "express-validator";

import {
    afterCheckSchema,
    asyncWrapper,
    authenticateAccessToken,
    checkRole,
} from "../middleware";

import { UserRoleType } from "../../entity/user_role";

import { helloRouters } from "./hello";
import { recruitCompanyRouters } from "./recruit_company";
import { miscRouters } from "./misc";
import { wantedAdsRouters } from "./wanted_ads";
import { officialNewsRouters } from "./official_news";
import { messageRouters } from "./rc/message";
import { offerRouters } from "./rc/offer";
import { myRecruitCompanyRouters } from "./rc/my_company";
import { myWantedAdsRouters } from "./rc/my_wanted_ads";

export type RouterConfigType = {
    path: string,
    method: string,
    class: any, // とりあえず
    callFunctionName: string,
    schema: any, // とりあえず
    mustRoles: UserRoleType[],
};

export const setRouters = (app: express.Express) => {
    helloRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    recruitCompanyRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    miscRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    wantedAdsRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    officialNewsRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    messageRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    offerRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    myRecruitCompanyRouters.forEach((config: RouterConfigType) => {
        setRouter(app, config);
    });
    myWantedAdsRouters.forEach((config: RouterConfigType) => {
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
                checkRole,
                checkSchema(config.schema),
                afterCheckSchema,
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
                checkRole,
                checkSchema(config.schema),
                afterCheckSchema,
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
                checkRole,
                checkSchema(config.schema),
                afterCheckSchema,
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
                checkRole,
                checkSchema(config.schema),
                afterCheckSchema,
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
