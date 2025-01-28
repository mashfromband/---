// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";
import { CommonUserHandler } from "../../common/user";

import { User } from "../../entity/user";
import { UserPrivateEducationalHistory } from "../../entity/user_private_educational_history";

import type {
    paths,
    components,
} from "../../types/api/contents";

type GetUserEducationalHistoryResponse =
    paths["/user/me/educational-history"]["get"]["responses"][200]["content"]["application/json"];
type OneUserEducationHistory =
    components["schemas"]["oneEducationalHistory"];

export class UserEducationalHistoryAPIController extends BaseAPIController {
    public async get() {
        const user: User | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.privateEducationalHistories", "user_private_educational_history")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                })
                .orderBy("user_private_educational_history.targetDate", "ASC")
                .addOrderBy("user_private_educational_history.id", "ASC")
            return query.getOne();
        });
        if (!user) {
            this.responseNoBody(404);
            return;
        }

        const userEducationalHistory = user.privateEducationalHistories;
        const historyList: OneUserEducationHistory[] = [];
        if (userEducationalHistory !== undefined && userEducationalHistory.length > 0) {
            for (const history of userEducationalHistory) {
                historyList.push({
                    id: history.outgoingId,
                    educationalHistory: history.educationalHistoery,
                    targetYear: moment(history.targetDate).format("YYYY"),
                    targetMonth: moment(history.targetDate).format("MM"),
                });
            }
        }

        const response: GetUserEducationalHistoryResponse = {
            educationalHistory: historyList,
        };
        this.responseJSON(response);
    }

    public async insertHistory() {
        const user: User | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            return await CommonUserHandler.getUserByUserId(manager, this.userId, false);
        });
        if (!user) {
            this.responseNoBody(404);
            return;
        }

        const userEducationalHistory = new UserPrivateEducationalHistory(
            user,
            moment({
                year: parseInt(this.req.body.targetYear, 10),
                month: parseInt(this.req.body.targetMonth, 10) - 1,
            }).toDate(),
            this.req.body.educationalHistory,
        );
        await userEducationalHistory.save();

        this.responseNoBody();
    }

    public async updateHistory() {
        const historyId = this.req.params.id;
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner ,manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserPrivateEducationalHistory, "upeh")
                .leftJoinAndSelect("upeh.user", "user")
                .where("upeh.outgoingId = :historyId")
                .setParameters({
                    historyId: historyId,
                })
                .setLock("pessimistic_write");
            const userPrivateEducationalHistory = await query.getOne();
            if (!userPrivateEducationalHistory || !userPrivateEducationalHistory.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }
            if (userPrivateEducationalHistory.user.id !== this.userId) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 403,
                        reason: "操作権限がありません。",
                    },
                };
            }

            userPrivateEducationalHistory.targetDate = moment({
                year: parseInt(this.req.body.targetYear, 10),
                month: parseInt(this.req.body.targetMonth, 10) - 1,
            }).toDate();
            userPrivateEducationalHistory.educationalHistoery = this.req.body.educationalHistory;

            await manager.save(userPrivateEducationalHistory);
            await queryRunner.commitTransaction();

            return {
                userPrivateEducationalHistory: userPrivateEducationalHistory,
            };
        });

        if (result.error) {
            this.responseJSON(
                result.error, result.error.status,
            );
            return;
        }

        this.responseNoBody();
    }

    public async deleteHistory() {
        const historyId = this.req.params.id;
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner ,manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserPrivateEducationalHistory, "upeh")
                .leftJoinAndSelect("upeh.user", "user")
                .where("upeh.outgoingId = :historyId")
                .setParameters({
                    historyId: historyId,
                })
                .setLock("pessimistic_write");
            const userPrivateEducationalHistory = await query.getOne();
            if (!userPrivateEducationalHistory || !userPrivateEducationalHistory.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }
            if (userPrivateEducationalHistory.user.id !== this.userId) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 403,
                        reason: "操作権限がありません。",
                    },
                };
            }

            await manager.softDelete(UserPrivateEducationalHistory, userPrivateEducationalHistory.id);
            await queryRunner.commitTransaction();

            return {
                isDelete: true,
            };
        });

        if (result.error) {
            this.responseJSON(
                result.error, result.error.status,
            );
            return;
        }

        this.responseNoBody();

    }
}
