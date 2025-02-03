// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";

import { RecruitCompanyWantedAds } from "../../entity/recruit_company_wanted_ads";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { RecruitCompanyInfo } from "../../entity/recruit_company_info";
import { RecruitCompany } from "../../entity/recruit_company";

type ResponseGetWantedAdsDetail =
    paths["/wanted-ads/{wantedAdsId}"]["get"]["responses"][200]["content"]["application/json"];
type ResponseGetWantedAdsSummaryList =
    paths["/wanted-ads"]["get"]["responses"][200]["content"]["application/json"];
type OneWantedAdsSummary =
    components["schemas"]["oneWantedAdsSummary"];

export class WantedAdsAPIController extends BaseAPIController {
    public async getDetail() {
        const outgoingId = this.req.params.wantedAdsId as string;
        const wantedAds = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompanyWantedAds, "rcwa")
                .leftJoinAndSelect("rcwa.recruteCompany", "recruit_company")
                .leftJoinAndSelect("recruit_company.info", "recruit_company_info")
                .where("rcwa.outgoingId = :outgoingId")
                .andWhere("rcwa.beginAt <= :now and rcwa.endAt > :now")
                .andWhere("recruit_company.beginPeriodAt <= :now and recruit_company.endPeriodAt > :now")
                .setParameters({
                    outgoingId: outgoingId,
                    now: this.accessDate,
                });
            return await query.getOne();
        });

        if (!wantedAds || !wantedAds.recruteCompany || !wantedAds.recruteCompany.info) {
            this.responseNoBody(404);
            return;
        }

        const response: ResponseGetWantedAdsDetail = {
            id: wantedAds.outgoingId,
            recruitCompanyId: wantedAds.recruteCompany.outgoingId,
            recruitCompanyName: wantedAds.recruteCompany.info.displayName,
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
            applicationDeadlineYear: moment(wantedAds.applicationDeadline).format("YYYY"),
            applicationDeadlineMonth: moment(wantedAds.applicationDeadline).format("MM"),
            applicationDeadlineDay: moment(wantedAds.applicationDeadline).format("DD"),
            updatedAtYear: moment(wantedAds.updatedAt).format("YYYY"),
            updatedAtMonth: moment(wantedAds.updatedAt).format("MM"),
            updatedAtDay: moment(wantedAds.updatedAt).format("DD"),
        };
        this.responseJSON(response);
    }

    public async getSummaryList() {
        const [adsList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompanyWantedAds, "rcwa")
                .leftJoinAndSelect("rcwa.recruteCompany", "recruit_company")
                .leftJoinAndSelect("recruit_company.info", "recruit_company_info")
                .where("rcwa.beginAt <= :now and rcwa.endAt > :now")
                .andWhere("recruit_company.beginPeriodAt <= :now and recruit_company.endPeriodAt > :now")
                .setParameters({
                    now: this.accessDate,
                });
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "rcwa"
            );
            return query.getManyAndCount();
        });

        const responseAdsList: OneWantedAdsSummary[] = [];
        for (const ads of adsList as RecruitCompanyWantedAds[]) {
            if (ads.recruteCompany && ads.recruteCompany.info) {
                responseAdsList.push({
                    id: ads.outgoingId,
                    recruitCompanyId: ads.recruteCompany.outgoingId,
                    recruitCompanyName: ads.recruteCompany.info.displayName,
                    position: ads.position,
                    details: ads.details,
                    updatedAtYear: moment(ads.updatedAt).format("YYYY"),
                    updatedAtMonth: moment(ads.updatedAt).format("MM"),
                    updatedAtDay: moment(ads.updatedAt).format("DD"),
                });
            }
        }

        const response: ResponseGetWantedAdsSummaryList = {
            ads: responseAdsList,
            total: total,
        };
        this.responseJSON(response);
    }
}
