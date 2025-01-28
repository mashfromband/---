// -*- coding: utf-8 -*-

import crypto from "node:crypto";

import {
    Request,
    Response,
    NextFunction,
} from "express";

export class CommonMiddleware {
    public static setAccessDate(req: Request, res: Response, next: NextFunction) {
        res.locals.accessDate = new Date();
        next();
    }
    
    public static setRequestId(req: Request, res: Response, next: NextFunction) {
        const requestId = crypto.randomUUID();
        res.header("X-Request-ID", requestId);
        res.locals.requestId = requestId;
        next();
    }

    public static setNoStore(req: Request, res: Response, next: NextFunction) {
        res.setHeader("Cache-Control", "no-store");
        next();
    }
}
