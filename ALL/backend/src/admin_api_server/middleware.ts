// -*- coding: utf-8 -*-

import {
    Request,
    Response,
    NextFunction,
} from "express";
import { validationResult } from "express-validator";

import {
    APIError,
    APIErrorType,
} from "./error";

import { AccessToken } from "../common/token/access_token";

export const asyncWrapper = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next);
    }
}

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const config = res.locals.config;
    if (req.method === "OPTIONS") {
        next();
        return;
    }

    const logger = req.log;

    const authorization = req.headers.authorization;
    if (!authorization) {
        logger.info("[authenticateAccessToken] ヘッダに Authorization が存在しないアクセスです。");
        res.status(401).send("");
        return;
    }

    const parsedAuthorization = authorization.split(' ');
    if (parsedAuthorization.length != 2 || parsedAuthorization[0] !== "Bearer") {
        logger.info({ authorization: authorization}, "[authenticateAccessToken] Authorization のフォーマットが間違っています。");
        res.status(401).send("");
        return;
    }

    const accessToken = parsedAuthorization[1];
    const payload = await AccessToken.verify(accessToken, res.locals.accessDate);
    if (!payload) {
        logger.info("[authenticateAccessToken] アクセストークンが無効です。");
        res.status(401).send("");
        return;
    }
    else {
        if (!payload.role) {
            logger.info("[authenticateAccessToken] アクセストークンに権限がありません。");
            res.status(403).send("");
            return;
        }

        res.locals.userId = payload.uid as string;
        res.locals.accessTokenExpire = payload.exp! * 1000; // unix time ミリ秒
        res.locals.role = payload.role;
        res.locals.recruitCompanyId = payload.cid;

        next();
    }
}

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
    const config = res.locals.config;
    const logger = req.log;
    const role = res.locals.role;

    if (config.mustRoles.includes(role)) {
        next();
        return;
    }

    logger.info("[checkRole] 権限がありません。");
    res.status(403).send("");
    return;
}

export const afterCheckSchema = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
    }
    else {
        const errors: APIError[] = [];
        // @ts-ignore
        result.errors.forEach((err) => {
            errors.push({
                status: 400,
                type: "ValidationError",
                message: err.msg,
                location: err.location,
                path: err.path,
            });
        });
        res.status(400).json({errors: errors});
    }
}
