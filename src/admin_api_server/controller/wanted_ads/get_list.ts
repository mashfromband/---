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

import { RecruitCompanyWantedAds } from "../../../entity/recruit_company_wanted_ads";

type ResponseType =
    paths["/wanted-ads"]["get"]["responses"]["200"]["content"]["application/json"];
type OneAdsType =
    components["schemas"]["getRecruitCompanyWantedAdsListResponse"];

export class GetRecruitCompanyWantedAdsListAdminAPIController extends BaseAPIController {
    public async getList() {
        const [wantedAdsList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompanyWantedAds, "rcwa")
                .leftJoinAndSelect("rcwa.recruteCompany", "recruit_company")
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "rcwa"
            );
            return query.getManyAndCount();
        });

        const responseList: OneAdsType[] = [];
        for (const ads of wantedAdsList as RecruitCompanyWantedAds[]) {
            responseList.push({
                id: ads.id,
                outgoingId: ads.outgoingId,
                companyId: ads.recruteCompany?.id || "", // とりあえず
                companyName: ads.recruteCompany?.name || "", // とりあえず
                title: ads.title,
            });
        }

        const response: ResponseType = {
            wantedAds: responseList,
            total: total as number,
        }
        this.responseJSON(response);
    }
}
