// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import type {
    paths,
    components,
} from "../../../types/api/management";

import { UserRecruitCompany } from "../../../entity/user_recruit_company";

type ResponseType =
    paths["/recruit-company/user/{recruitCompanyId}"]["get"]["responses"]["200"]["content"]["application/json"];
type OneUserType =
    components["schemas"]["oneRecruitCompanyUser"];

export class GetRecruitCompanyUserListAdminAPIController extends BaseAPIController {
    public async getList() {
        const recruitCompanyId = this.req.params.recruitCompanyId as string;

        const [recruitCompanyUserList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserRecruitCompany, "urc")
                .leftJoinAndSelect("urc.user", "user")
                .where("urc.recruteCompanyId = :recruitCompanyId")
                .setParameters({
                    recruitCompanyId: recruitCompanyId,
                });
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "urc"
            );
            return query.getManyAndCount();
        });

        const responseList: OneUserType[] = [];
        for (const recruitCompanyUser of recruitCompanyUserList as UserRecruitCompany[]) {
            responseList.push({
                userId: recruitCompanyUser.user!.id,
                mailAddress: recruitCompanyUser.user!.mailAddress,
                isReceverApplyJobFromUser: recruitCompanyUser.receverApplyJobFromUser,
            });
        }

        const response: ResponseType = {
            users: responseList,
            total: total as number,
        }
        this.responseJSON(response);
    }
}
