// -*- coding: utf-8 -*-

import {
    Request,
    Response,
    NextFunction,
} from "express";
import Pino from "pino";

import { RouterConfigType } from "../router/define";

export class BaseAPIController {

    protected req: Request;
    protected res: Response;
    protected next: NextFunction;

    readonly requestId: string;
    readonly accessDate: Date;
    readonly srcIpAddress: string | undefined;
    readonly userId: string | undefined;

    readonly routerConfig: RouterConfigType;

    readonly logger: Pino.Logger<never>; // MEMO: 生で使わないこと

    constructor(req: Request, res: Response, next: NextFunction, routerConfig: RouterConfigType) {
        this.req = req;
        this.res = res;
        this.next = next;

        this.routerConfig = routerConfig;

        this.requestId = res.locals.requestId as string;
        this.accessDate = res.locals.accessDate as Date;
        this.srcIpAddress = req.ip;
        this.userId = res.locals.userId;

        this.logger = this.req.log;
    }

    private setProcessingMsec() {
        const now = new Date();
        const processingTime = now.getTime() - this.accessDate.getTime();
        this.res.header("X-Processing-Msec", processingTime.toString());
    }

    protected responseJSON(response: any, statusCode?: number) {
        const status = statusCode || 200;
        this.setProcessingMsec();
        this.res.status(status).json(response);
        this.loggingInfo("success response", {
            response: response,
            statusCode: status,
        });
    }

    protected responseNoBody(statusCode?: number) {
        const status = statusCode || 204;
        this.setProcessingMsec();
        this.res.status(status).send("");
        this.loggingInfo("success response", {
            statusCode: status,
        });
    }

    protected loggingInfo(message: string, obj?: any) {
        if (!obj) {
            this.logger.info(message);
        }
        else {
            const logger = this.logger.child(obj);
            logger.info(message);
        }
    }

    protected loggingError(message: string, obj?: any) {
        if (!obj) {
            this.logger.error(message);
        }
        else {
            const logger = this.logger.child(obj);
            logger.error(message);
        }
    }

    protected loggingWarn(message: string, obj?: any) {
        if (!obj) {
            this.logger.warn(message);
        }
        else {
            const logger = this.logger.child(obj);
            logger.warn(message);
        }
    }

    protected loggingFatal(message: string, obj?: any) {
        if (!obj) {
            this.logger.fatal(message);
        }
        else {
            const logger = this.logger.child(obj);
            logger.fatal(message);
        }
    }

    protected loggingDebug(message: string, obj?: any) {
        if (!obj) {
            this.logger.debug(message);
        }
        else {
            const logger = this.logger.child(obj);
            logger.debug(message);
        }
    }
}
