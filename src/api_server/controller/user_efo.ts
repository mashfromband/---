// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";

import { CommonGetUserHaveEfoHandler } from "../../common/efo/get_user_have";
import { CommonComsumeUserHaveEfoHandler } from "../../common/efo/consume";
import { CommonGetUserHaveRealHandler } from "../../common/real/get_user_have";
import { CommonRealEfoRateHandler } from "../../common/real/rate";
import { CommonAddUserHaveRealHandler } from "../../common/real/add";
import { CommonUserHandler } from "../../common/user";

import { User } from "../../entity/user";
import { UserEfoHistory } from "../../entity/user_efo_history";

import type { UserHaveTotalEfoType } from "../../common/efo/get_user_have";

import type {
    paths,
    components,
} from "../../types/api/contents";

type GetUserHaveEfoResponseType =
    paths["/user/me/efo"]["get"]["responses"][200]["content"]["application/json"];

type GetUserEfoHistoryResponseType =
    paths["/user/me/efo/history"]["get"]["responses"][200]["content"]["application/json"];
type OneUserEfoHistoryType =
    components["schemas"]["oneUserEfoHistory"];

type GetUserEfoHistoryTargetType = "all" | "addOnly" | "consumeOnly";

type GetOneUserEfoHistoryResponseType =
    paths["/user/me/efo/{transactionId}"]["get"]["responses"][200]["content"]["application/json"];

type PostUserEfoExchangeToRealRequestType =
    paths["/user/me/efo/exchange/real"]["post"]["requestBody"]["content"]["application/json"];
type PostUserEfoExchangeToRealSuccessResponseType =
    paths["/user/me/efo/exchange/real"]["post"]["responses"][200]["content"]["application/json"];
type PostUserEfoExchangeToRealFailResponseType =
    paths["/user/me/efo/exchange/real"]["post"]["responses"][409]["content"]["application/json"];

export class UserEfoAPIController extends BaseAPIController {
    public async getUserHaveEfo() {
        const resultUserHaveEfo = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            return await CommonGetUserHaveEfoHandler.getUserHaveTotalEfo(
                manager, this.userId, this.accessDate,
            );
        });

        const userHaveEfo = resultUserHaveEfo as UserHaveTotalEfoType;

        const response: GetUserHaveEfoResponseType = {
            haveEfo: userHaveEfo.haveEfo,
            totalAddEfo: userHaveEfo.totalAddEfo,
            totalConsumeEfo: userHaveEfo.totalConsumeEfo,
        };
        this.responseJSON(response);
    }

    public async getUserEfoHistory() {
        const target = this.getHistoryTarget();
        const [userEfoHistories, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserEfoHistory, "ueh")
                .where("ueh.userId = :userId");
            if (target === "addOnly") {
                query.andWhere("ueh.modifyEfo > 0");
            }
            else if (target === "consumeOnly") {
                query.andWhere("ueh.modifyEfo < 0");
            }
            query.setParameters({
                userId: this.userId,
            });
            this.setOrderByOffsetLimit(
                query, ["createdAt", "updatedAt"], "-createdAt", "ueh",
            );
            return await query.getManyAndCount();
        });

        if (userEfoHistories.length === 0) {
            const response: GetUserEfoHistoryResponseType = {
                histories: [],
                total: total,
            };
            this.responseJSON(response);
            return;
        }

        const userEfoHistoryList: OneUserEfoHistoryType[] = [];
        for (const history of userEfoHistories as UserEfoHistory[]) {
            userEfoHistoryList.push(this.createOneUserEfoHistory(history));
        }

        const response: GetUserEfoHistoryResponseType = {
            histories: userEfoHistoryList,
            total: total,
        };
        this.responseJSON(response);
    }

    private getHistoryTarget(): GetUserEfoHistoryTargetType {
        const target = this.req.query.target;
        if (!target) {
            return "all";
        }
        return target as GetUserEfoHistoryTargetType;
    }

    private createOneUserEfoHistory(history: UserEfoHistory): OneUserEfoHistoryType {
        return {
            transactionId: history.transactionId,
            addEfo: history.modifyEfo > 0 ? history.modifyEfo : 0,
            consumeEfo: history.modifyEfo < 0 ? history.modifyEfo : 0,
            reason: history.reason,
            createdAtYear: moment(history.createdAt).format("YYYY"),
            createdAtMonth: moment(history.createdAt).format("MM"),
            createdAtDay: moment(history.createdAt).format("DD"),
            createdAtHour: moment(history.createdAt).format("HH"),
            createdAtMinute: moment(history.createdAt).format("mm"),
            createdAtSecond: moment(history.createdAt).format("ss"),
        }
    }

    public async getOneUserEfoHistory() {
        const transactionId = this.req.params.transactionId as string;
        const userEfoHistory = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserEfoHistory, "ueh")
                .where("ueh.userId = :userId and ueh.transactionId = :transactionId")
                .setParameters({
                    userId: this.userId,
                    transactionId: transactionId,
                });
            return await query.getOne();
        });

        if (!userEfoHistory) {
            this.responseNoBody(404);
            return;
        }

        const response: GetOneUserEfoHistoryResponseType = this.createOneUserEfoHistory(userEfoHistory as UserEfoHistory);
        this.responseJSON(response);
    }

    public async exchangeReal() {
        const request = this.req.body as PostUserEfoExchangeToRealRequestType;
        if (request.hopeToExchangeReal <= 0) {
            const response: PostUserEfoExchangeToRealFailResponseType = {
                reason: "invalidHopeToExchangeReal",
                message: "交換したいREAL数は1以上である必要があります",
            };
            this.responseJSON(response, 409);
            return;
        }

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const rate = await CommonRealEfoRateHandler.getCurrentRate(this.logger, manager, this.accessDate);

            const user = await CommonUserHandler.getUserByUserId(manager, this.userId, false);
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                    },
                };
            }

            const consumeEfo = request.hopeToExchangeReal * rate.oneRealToEfo;
            const resultConsumeEfo = await this.consumeEfoForExchangeReal(manager, user, consumeEfo);
            if (!resultConsumeEfo.isSuccess) {
                await queryRunner.rollbackTransaction();
                const response: PostUserEfoExchangeToRealFailResponseType = {
                    reason: "notEnoughHavingEfo",
                    message: resultConsumeEfo.message,
                };
                return {
                    error: {
                        status: 409,
                        response: response,
                    },
                };
            }

            const transactionId = resultConsumeEfo.transactionId;
            const resultAddReal = await CommonAddUserHaveRealHandler.exchangeEfoToReal(
                manager, this.logger, user, request.hopeToExchangeReal,
                "normal", "exchangeFromEfo", rate, transactionId, this.accessDate,
            );
            const currentReal = await CommonGetUserHaveRealHandler.getUserHaveTotalReal(manager, this.userId, this.accessDate);

            await queryRunner.commitTransaction();

            await CommonGetUserHaveEfoHandler.clearCache(this.userId);
            await CommonGetUserHaveRealHandler.clearCache(this.userId);

            const response: PostUserEfoExchangeToRealSuccessResponseType = {
                transactionId: transactionId,
                consumeEfo: consumeEfo,
                currentEfo: resultConsumeEfo.currentEfo - consumeEfo,
                addReal: request.hopeToExchangeReal,
                currentReal: currentReal.haveReal,
                rate: rate.oneRealToEfo,
            };

            return {
                response: response,
            }
        });

        if (result.error) {
            if (result.error.response) {
                this.responseJSON(result.error.response, result.error.status);
            }
            else {
                this.responseNoBody(result.error.status);
            }
            return;
        }

        this.responseJSON(result.response);
    }

    private async consumeEfoForExchangeReal(manager: EntityManager, user: User, consumeEfo: number) {
        const ins = new CommonComsumeUserHaveEfoHandler(this.logger, user, consumeEfo, "exchangeReal");
        return ins.consume(manager, this.accessDate);
    }
}
