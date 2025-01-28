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
import { UserPrivateHaveLicense } from "../../entity/user_private_have_license_history";

import type {
    paths,
    components,
} from "../../types/api/contents";

type GetUserHaveLicenseResponse =
    paths["/user/me/have-license"]["get"]["responses"][200]["content"]["application/json"];
type OneUserLicense =
    components["schemas"]["oneLicense"];

export class UserHaveLicenseAPIController extends BaseAPIController {
    public async get() {
        const user: User | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.privateHaveLicenses", "user_private_have_license")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                })
                .orderBy("user_private_have_license.targetDate", "ASC")
                .addOrderBy("user_private_have_license.id", "ASC");
            return query.getOne();
        });
        if (!user) {
            this.responseNoBody(404);
            return;
        }

        const userHaveLicense = user.privateHaveLicenses;
        const historyList: OneUserLicense[] = [];
        if (userHaveLicense !== undefined && userHaveLicense.length > 0) {
            for (const history of userHaveLicense) {
                historyList.push({
                    id: history.outgoingId,
                    license: history.license,
                    targetYear: moment(history.targetDate).format("YYYY"),
                    targetMonth: moment(history.targetDate).format("MM"),
                });
            }
        }

        const response: GetUserHaveLicenseResponse = {
            haveLicense: historyList,
        };
        this.responseJSON(response);
    }

    public async insertLicense() {
        const user: User | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            return await CommonUserHandler.getUserByUserId(manager, this.userId!, false);
        });
        if (!user) {
            this.responseNoBody(404);
            return;
        }

        const userHaveLicense = new UserPrivateHaveLicense(
            user,
            moment({
                year: parseInt(this.req.body.targetYear, 10),
                month: parseInt(this.req.body.targetMonth, 10) - 1,
            }).toDate(),
            this.req.body.license,
        );
        await userHaveLicense.save();

        this.responseNoBody();
    }

    public async updateLicense() {
        const licenseId = this.req.params.id;
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner ,manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserPrivateHaveLicense, "uphl")
                .leftJoinAndSelect("uphl.user", "user")
                .where("uphl.outgoingId = :outgoingId")
                .setParameters({
                    outgoingId: licenseId,
                })
                .setLock("pessimistic_write");
            const userHaveLicense = await query.getOne();
            if (!userHaveLicense || !userHaveLicense.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }
            if (userHaveLicense.user.id !== this.userId) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 403,
                        reason: "操作権限がありません。",
                    },
                };
            }

            userHaveLicense.targetDate = moment({
                year: parseInt(this.req.body.targetYear, 10),
                month: parseInt(this.req.body.targetMonth, 10) - 1,
            }).toDate();
            userHaveLicense.license = this.req.body.license;

            await manager.save(userHaveLicense);
            await queryRunner.commitTransaction();

            return {
                userHaveLicense: userHaveLicense,
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

    public async deleteLicense() {
        const licenseId = this.req.params.id;
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner ,manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserPrivateHaveLicense, "uphl")
                .leftJoinAndSelect("uphl.user", "user")
                .where("uphl.outgoingId = :outgoingId")
                .setParameters({
                    outgoingId: licenseId,
                })
                .setLock("pessimistic_write");
            const userHaveLicense = await query.getOne();
            if (!userHaveLicense || !userHaveLicense.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }
            if (userHaveLicense.user.id !== this.userId) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 403,
                        reason: "操作権限がありません。",
                    },
                };
            }

            await manager.softDelete(UserPrivateHaveLicense, userHaveLicense.id);
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
