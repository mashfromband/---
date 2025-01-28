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
import { UserRole } from "../../../entity/user_role";

export class CreateRecruitCompanyUserAdminAPIController extends BaseAPIController {
    public async createUser() {
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

            let userRole = await this.getUserRole(manager, user.id);
            if (!userRole) {
                const newUserRole = new UserRole(user, "recruitCompany");
                await manager.save(newUserRole);
                userRole = newUserRole;
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

            const userRecruitCompany = await this.getUserRecruitCompany(manager, user.id, recruitCompany.id);
            if (userRecruitCompany) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 400,
                        reason: "すでに登録済みのユーザーです",
                    },
                };
            }

            const newUserRecruitCompanyUser = new UserRecruitCompany(user, recruitCompany);
            await manager.save(newUserRecruitCompanyUser);
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

    private async getUserRecruitCompany(manager: EntityManager, userId: string, recruitCompanyId: string) {
        const query = manager
            .createQueryBuilder(UserRecruitCompany, "urc")
            .where("urc.userId = :userId and urc.recruteCompanyId = :recruitCompanyId")
            .setParameters({
                userId: userId,
                recruitCompanyId: recruitCompanyId,
            });
        return query.getOne();
    }

    private async getUserRole(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserRole, "ur")
            .where("ur.userId = :userId and ur.role = :role")
            .setParameters({
                userId: userId,
                role: "recruitCompany",
            })
            .limit(1);
        return query.getOne();
    }
}
