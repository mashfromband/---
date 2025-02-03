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

import { RecruitCompany } from "../../../entity/recruit_company";

type ResponseType =
    paths["/recruit-company"]["get"]["responses"]["200"]["content"]["application/json"];

export class GetRecruitCompanyListAdminAPIController extends BaseAPIController {
    public async getList() {
        const [recruitCompanyList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompany, "rc")
                .leftJoinAndSelect("rc.companyCode", "recruit_company_code");
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "rc"
            );
            return query.getManyAndCount();
        });

        const responseList = [];
        for (const recruitCompany of recruitCompanyList as RecruitCompany[]) {
            responseList.push({
                id: recruitCompany.id,
                outgoingId: recruitCompany.outgoingId,
                cpcode: recruitCompany.companyCode!.companyCode,
                name: recruitCompany.name,
            })
        }

        const response: ResponseType = {
            recruitCompanies: responseList,
            total: total as number,
        }
        this.responseJSON(response);
    }
}
