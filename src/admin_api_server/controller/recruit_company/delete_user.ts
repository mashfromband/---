// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";
import { CommonUserHandler } from "../../../common/user";
import { CommonRecruitCompanyHandler } from "../../../common/recruit_company";

import type {
    paths,
    components,
} from "../../../types/api/management";

import { UserRecruitCompany } from "../../../entity/user_recruit_company";

export class DeleteRecruitCompanyUserAdminAPIController extends BaseAPIController {
    public async deleteUser() {
        const recruitCompanyId = this.req.params.recruitCompanyId as string;
        const mailAddress = this.req.body.mailAddress as string;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByMailAddress(manager, mailAddress, true); // MEMO: ロック取っているの注意
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "登録されていないメールアドレスです",
                    },
                };
            }

            const recruitCompany = await CommonRecruitCompanyHandler.getRecruitCompanyById(
                manager, recruitCompanyId, false,
            );
            if (!recruitCompany) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "存在しない求人企業です",
                    },
                };
            }

            const userRecruitCompany = await this.getUserRecruitCompany(manager, user.id, recruitCompany.id, true);
            if (!userRecruitCompany) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "登録されていないユーザーです",
                    },
                };
            }

            await manager.delete(UserRecruitCompany, userRecruitCompany.id);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
            };
        });

        if (result.isError) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        this.responseNoBody(204);
    }

    private async getUserRecruitCompany(manager: EntityManager, userId: string, recruitCompanyId: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(UserRecruitCompany, "urc")
            .where("urc.userId = :userId and urc.recruteCompanyId = :recruitCompanyId")
            .setParameters({
                userId: userId,
                recruitCompanyId: recruitCompanyId,
            });
            if (forUpdate) {
                query.setLock("pessimistic_write");
            }
        return query.getOne();
    }
}
