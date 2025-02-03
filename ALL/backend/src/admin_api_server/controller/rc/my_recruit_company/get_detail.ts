// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../../../utils/db";
import { BaseAPIController } from "../../base";

import type {
    paths,
    components,
} from "../../../../types/api/management";
import { RecruitCompany } from "../../../../entity/recruit_company";
import { RecruitCompanyInfo } from "../../../../entity/recruit_company_info";

type SuccessResponseType =
    paths["/rc/my-recruit-company"]["get"]["responses"]["200"]["content"]["application/json"];

export class GetMyRecruitCompanyDetailAPIController extends BaseAPIController {
    public async getDetail() {
        const recruitCompanyInfo: RecruitCompanyInfo | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompanyInfo, "rci")
                .leftJoinAndSelect("rci.recruitCompany", "recruit_company")
                .leftJoinAndSelect("rci.companyType", "company_type")
                .leftJoinAndSelect("recruit_company.companyCode", "recruit_company_code")
                .where("recruit_company.id = :recruitCompanyId")
                .setParameters({
                    recruitCompanyId: this.recruitCompanyId,
                });
            return query.getOne();
        });

        if (!recruitCompanyInfo || !recruitCompanyInfo.recruitCompany || !recruitCompanyInfo.companyType || !recruitCompanyInfo.recruitCompany.companyCode) {
            this.responseNoBody(404);
            return;
        }

        const response: SuccessResponseType = {
            id: recruitCompanyInfo.recruitCompany.id,
            outgoingId: recruitCompanyInfo.recruitCompany.outgoingId,
            cpcode: recruitCompanyInfo.recruitCompany.companyCode.companyCode,
            name: recruitCompanyInfo.recruitCompany.name,
            companyTypeId: recruitCompanyInfo.companyType.id,
            beginPeriodAt: moment(recruitCompanyInfo.recruitCompany.beginPeriodAt).format("YYYY-MM-DD"),
            endPeriodAt: moment(recruitCompanyInfo.recruitCompany.endPeriodAt).format("YYYY-MM-DD"),
            displayName: recruitCompanyInfo.displayName,
            establishmentDate: moment(recruitCompanyInfo.establishmentDate).format("YYYY-MM-DD"),
            postalCode: recruitCompanyInfo.postalCode,
            prefectureCode: recruitCompanyInfo.prefectureCode,
            address: recruitCompanyInfo.address,
            phoneNumber: recruitCompanyInfo.phoneNumber,
            faxNumber: recruitCompanyInfo.faxNumber || "",
            officialSiteUrl: recruitCompanyInfo.officialSiteUrl,
            profile: recruitCompanyInfo.profile,
            employees: recruitCompanyInfo.employees,
            netSales: recruitCompanyInfo.netSales,
            contactPersonName: recruitCompanyInfo.contactPersonName,
            contactPersonPosition: recruitCompanyInfo.contactPersonPosition,
            contactPersonPhoneNumber: recruitCompanyInfo.contactPersonPhoneNumber,
            contactPersionMailAddress: recruitCompanyInfo.contactPersionMailAddress,
        };
        this.responseJSON(response);
    }
}
