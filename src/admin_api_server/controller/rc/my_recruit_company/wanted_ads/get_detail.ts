// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../../../../utils/db";
import { BaseAPIController } from "../../../base";

import type {
    paths,
    components,
} from "../../../../../types/api/management";

import { RecruitCompanyWantedAds } from "../../../../../entity/recruit_company_wanted_ads";

type SuccessResponseType =
    paths["/rc/my-recruit-company/wanted-ads/{wantedAdsId}"]["get"]["responses"]["200"]["content"]["application/json"];

export class GetMyRecruitCompanyWantedAdsDetailAPIController extends BaseAPIController {
    public async getDetail() {
        const wantedAdsId = this.req.params.wantedAdsId as string;

        const wantedAds: RecruitCompanyWantedAds | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompanyWantedAds, "rcwa")
                .leftJoinAndSelect("rcwa.recruteCompany", "recruit_company")
                .where("rcwa.id = :wantedAdsId and rcwa.recruteCompanyId = :recruitCompanyId")
                .setParameters({
                    wantedAdsId: wantedAdsId,
                    recruitCompanyId: this.recruitCompanyId,
                });
            return query.getOne();
        });

        if (!wantedAds || !wantedAds.recruteCompany) {
            this.responseNoBody(404);
            return;
        }

        const response: SuccessResponseType = {
            id: wantedAds.id,
            outgoingId: wantedAds.outgoingId,
            companyId: wantedAds.recruteCompany.id,
            companyName: wantedAds.recruteCompany.name,
            title: wantedAds.title,
            position: wantedAds.position,
            workLocation: wantedAds.workLocation,
            employmentStatus: wantedAds.employmentStatus,
            numberOfPeople: wantedAds.numberOfPeople,
            details: wantedAds.details,
            requirements: wantedAds.requirements,
            salaryAndBenefits: wantedAds.salaryAndBenefits,
            officeHour: wantedAds.officeHour,
            dayOff: wantedAds.dayOff,
            welfareProgram: wantedAds.welfareProgram,
            howToApply: wantedAds.howToApply,
            applicationDocuments: wantedAds.applicationDocuments,
            applicationDeadline: moment(wantedAds.applicationDeadline).format("YYYY-MM-DD"),
            beginAt: moment(wantedAds.beginAt).format("YYYY-MM-DD"),
            endAt: moment(wantedAds.endAt).format("YYYY-MM-DD"),
        };
        this.responseJSON(response);
    }
}
