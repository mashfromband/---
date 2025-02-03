// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import type {
    paths,
    components,
} from "../../../types/api/management";

import { UserRecruitCompany } from "../../../entity/user_recruit_company";

type ChangeRecruitCompanyReceiveUserRequest =
    paths["/recruit-company/{recruitCompanyId}/receive-apply-job-user"]["put"]["requestBody"]["content"]["application/json"];

export class ChangeRecruitCompanyReceiveUserAdminAPIController extends BaseAPIController {
    public async changeReceiveUser() {
        const recruitCompanyId = this.req.params.recruitCompanyId as string;
        const request = this.req.body as ChangeRecruitCompanyReceiveUserRequest;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const getUserListQuery = manager
                .createQueryBuilder(UserRecruitCompany, "urc")
                .leftJoinAndSelect("urc.user", "user")
                .where("urc.recruteCompanyId = :recruitCompanyId")
                .setParameters({
                    recruitCompanyId: recruitCompanyId,
                })
                .setLock("pessimistic_write");
            const userList = await getUserListQuery.getMany();

            if (!userList) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "求人企業ユーザーが登録されていません",
                    },
                };
            }

            let isExistUser = false;
            for (const user of userList) {
                if (user.user!.id === request.userId) {
                    user.receverApplyJobFromUser = true;
                    isExistUser = true;
                }
                else {
                    user.receverApplyJobFromUser = false;
                }
                await manager.save(user);
            }

            if (!isExistUser) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "求人企業ユーザーに登録されていないユーザーです",
                    },
                };
            }

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
}
