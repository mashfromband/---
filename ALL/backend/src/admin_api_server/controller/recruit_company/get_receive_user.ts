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
    paths["/recruit-company/{recruitCompanyId}/receive-apply-job-user"]["get"]["responses"]["200"]["content"]["application/json"];

export class GetRecruitCompanyReceiveUserAdminAPIController extends BaseAPIController {
    public async getReceiveUser() {
        const recruitCompanyId = this.req.params.recruitCompanyId as string;

        const receiveUser: UserRecruitCompany = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserRecruitCompany, "urc")
                .leftJoinAndSelect("urc.user", "user")
                .where("urc.recruteCompanyId = :recruitCompanyId and urc.receverApplyJobFromUser = :receverApplyJobFromUser")
                .setParameters({
                    recruitCompanyId: recruitCompanyId,
                    receverApplyJobFromUser: true,
                })
                .orderBy("urc.id", "DESC")
                .limit(1);
            return await query.getOne();
        });

        if (!receiveUser || !receiveUser.user) {
            this.responseNoBody(404);
            return;
        }

        const response: ResponseType = {
            userId: receiveUser.user.id,
            mailAddress: receiveUser.user.mailAddress,
            isReceverApplyJobFromUser: receiveUser.receverApplyJobFromUser,
        };
        this.responseJSON(response);
    }
}
