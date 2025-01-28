// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import type {
    paths,
    components,
} from "../../../types/api/management";

import { RecruitCompanyWantedAds } from "../../../entity/recruit_company_wanted_ads";
import { RecruitCompany } from "../../../entity/recruit_company";

type RequestType =
    paths["/wanted-ads"]["post"]["requestBody"]["content"]["application/json"];

export class PostCreateRecruitCompanyWantedAdsAdminAPIController extends BaseAPIController {
    public async create() {
        const requestBody = this.req.body as RequestType;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const recruitCompany = await manager
                .createQueryBuilder(RecruitCompany, "rc")
                .where("rc.id = :recruitCompanyId")
                .setParameters({
                    recruitCompanyId: requestBody.companyId,
                })
                .getOne();
            if (!recruitCompany) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "求人企業が存在しません",
                    },
                };
            }

            const wantedAds = new RecruitCompanyWantedAds(recruitCompany);
            wantedAds.title = requestBody.title;
            wantedAds.position = requestBody.position;
            wantedAds.workLocation = requestBody.workLocation;
            wantedAds.employmentStatus = requestBody.employmentStatus;
            wantedAds.numberOfPeople = requestBody.numberOfPeople;
            wantedAds.details = requestBody.details;
            wantedAds.requirements = requestBody.requirements;
            wantedAds.salaryAndBenefits = requestBody.salaryAndBenefits;
            wantedAds.officeHour = requestBody.officeHour;
            wantedAds.dayOff = requestBody.dayOff;
            wantedAds.welfareProgram = requestBody.welfareProgram;
            wantedAds.howToApply = requestBody.howToApply;
            wantedAds.applicationDocuments = requestBody.applicationDocuments;
            wantedAds.applicationDeadline = moment(requestBody.applicationDeadline, "YYYY-MM-DD").toDate();
            wantedAds.beginAt = moment(requestBody.beginAt, "YYYY-MM-DD").toDate();
            wantedAds.endAt = moment(requestBody.endAt, "YYYY-MM-DD").toDate();

            await manager.save(wantedAds);
            await queryRunner.commitTransaction();

            return {
                wantedAds: wantedAds,
            }
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        this.responseNoBody(204);
    }
}
