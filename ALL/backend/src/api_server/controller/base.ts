// -*- coding: utf-8 -*-

import {
    Request,
    Response,
    NextFunction,
} from "express";
import Pino from "pino";

import { RouterConfigType } from "../router/define";
import { SelectQueryBuilder } from "typeorm";

export class BaseAPIController {

    protected req: Request;
    protected res: Response;
    protected next: NextFunction;

    readonly userId: string;
    readonly requestId: string;
    readonly accessDate: Date;
    readonly srcIpAddress: string | undefined;

    readonly routerConfig: RouterConfigType;

    readonly logger: Pino.Logger<never>; // MEMO: 生で使わないこと

    constructor(req: Request, res: Response, next: NextFunction, routerConfig: RouterConfigType) {
        this.req = req;
        this.res = res;
        this.next = next;

        this.routerConfig = routerConfig;

        this.userId = res.locals.userId || "guest";
        this.requestId = res.locals.requestId as string;
        this.accessDate = res.locals.accessDate as Date;
        this.srcIpAddress = req.ip;

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

    protected getOrderInfo(allowColumns: string[], defaultColumn: string) {
        const order: any = []; // とりあえず

        const defaultOrder: any = [];
        if (defaultColumn[0] === '-') {
            defaultOrder.push({
                column: defaultColumn.substring(1),
                arrangement: "DESC",
            });
        }
        else {
            defaultOrder.push({
                column: defaultColumn,
                arrangement: "ASC",
            });
        }

        if (this.req.query.sort === undefined) {
            return defaultOrder;
        }

        const parsedSort = (this.req.query.sort as string).split(",");
        if (parsedSort.length === 0) {
            return defaultOrder;
        }

        for (let i = 0; i < parsedSort.length; i++) {
            const arrangement = parsedSort[i].startsWith("-") ? "DESC" : "ASC";
            const column = parsedSort[i].replace(/^\-/, "");
            if (allowColumns.includes(column)) {
                order.push({
                    column: column,
                    arrangement: arrangement,
                })
            }
        }

        if (order.length === 0) {
            return defaultOrder;
        }

        return order;
    }

    protected getOffset() {
        let offset = 0;
        if (this.req.query.offset) {
            offset = parseInt(this.req.query.offset as string, 10);
        }
        return offset;
    }

    protected getLimit() {
        let limit = 10;
        if (this.req.query.limit) {
            limit = parseInt(this.req.query.limit as string, 10);
        }
        if (limit > 100) {
            limit = 100;
        }
        return limit;
    }

    protected setOrderByOffsetLimit(
        query: SelectQueryBuilder<any>,
        sortAllowColumns: string[],
        sortDefaultColumn: string,
        tabelAlias: string,
        isFirstOrderBy: boolean = true,
) {
        const orderList = this.getOrderInfo(sortAllowColumns, sortDefaultColumn);
        const offset = this.getOffset();
        const limit = this.getLimit();

        let isFirst = true;
        if (!isFirstOrderBy) {
            isFirst = false;
        }

        for (const order of orderList) {
            if (isFirst) {
                query.orderBy(tabelAlias + "." + order.column, order.arrangement);
                isFirst = false;
            }
            else {
                query.addOrderBy(tabelAlias + "." + order.column, order.arrangement);
            }
        }

        query.offset(offset);
        query.limit(limit);

        return query;
    }
}
