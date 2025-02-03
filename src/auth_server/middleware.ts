// -*- coding: utf-8 -*-

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AccessToken } from "../common/token/access_token";

export const asyncWrapper = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next);
    }
}

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const config = res.locals.config;
    if (req.method === "OPTIONS" || config.allowNoAuccessToken) {
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
        res.locals.userId = payload.uid as string;
        res.locals.accessTokenExpire = payload.exp! * 1000; // unix time ミリ秒
        next();
    }
}
