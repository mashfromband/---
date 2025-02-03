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
import { UserPrivateJobHistroy } from "../../entity/user_private_job_history";

import type {
    paths,
    components,
} from "../../types/api/contents";

type GetUserJobHistoryResponse =
    paths["/user/me/job-history"]["get"]["responses"][200]["content"]["application/json"];
type OneUserJobHistory =
    components["schemas"]["oneJobHistory"];

export class UserJobHistoryAPIController extends BaseAPIController {
    public async get() {
        const user: User | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.privateJobHistories", "user_private_job_history")
            .where("user.id = :userId and user.isValid = :isValid")
            .setParameters({
                userId: this.userId,
                isValid: true,
            })
            .orderBy("user_private_job_history.targetDate", "ASC")
            .addOrderBy("user_private_job_history.id", "ASC");
            return query.getOne();
        });
        if (!user) {
            this.responseNoBody(404);
            return;
        }

        const userJobHistory = user.privateJobHistories;
        const historyList: OneUserJobHistory[] = [];
        if (userJobHistory !== undefined && userJobHistory.length > 0) {
            for (const history of userJobHistory) {
                historyList.push({
                    id: history.outgoingId,
                    jobHistory: history.jobHistory,
                    targetYear: moment(history.targetDate).format("YYYY"),
                    targetMonth: moment(history.targetDate).format("MM"),
                });
            }
        }

        const response: GetUserJobHistoryResponse = {
            jobHistory: historyList,
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

        const userJobHistory = new UserPrivateJobHistroy(
            user,
            moment({
                year: parseInt(this.req.body.targetYear, 10),
                month: parseInt(this.req.body.targetMonth, 10) - 1,
            }).toDate(),
            this.req.body.jobHistory,
        );
        await userJobHistory.save();

        this.responseNoBody();
    }

    public async updateHistory() {
        const historyId = this.req.params.id;
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner ,manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserPrivateJobHistroy, "upjh")
                .leftJoinAndSelect("upjh.user", "user")
                .where("upjh.outgoingId = :historyId")
                .setParameters({
                    historyId: historyId,
                })
                .setLock("pessimistic_write");
            const userPrivateJobHistory = await query.getOne();
            if (!userPrivateJobHistory || !userPrivateJobHistory.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }
            if (userPrivateJobHistory.user.id !== this.userId) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 403,
                        reason: "操作権限がありません。",
                    },
                };
            }

            userPrivateJobHistory.targetDate = moment({
                year: parseInt(this.req.body.targetYear, 10),
                month: parseInt(this.req.body.targetMonth, 10) - 1,
            }).toDate();
            userPrivateJobHistory.jobHistory = this.req.body.jobHistory;

            await manager.save(userPrivateJobHistory);
            await queryRunner.commitTransaction();

            return {
                userPrivateJobHistory: userPrivateJobHistory,
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
                .createQueryBuilder(UserPrivateJobHistroy, "upjh")
                .leftJoinAndSelect("upjh.user", "user")
                .where("upjh.outgoingId = :historyId")
                .setParameters({
                    historyId: historyId,
                })
                .setLock("pessimistic_write");
            const userPrivateJobHistory = await query.getOne();
            if (!userPrivateJobHistory || !userPrivateJobHistory.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }
            if (userPrivateJobHistory.user.id !== this.userId) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 403,
                        reason: "操作権限がありません。",
                    },
                };
            }

            await manager.softDelete(UserPrivateJobHistroy, userPrivateJobHistory.id);
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
