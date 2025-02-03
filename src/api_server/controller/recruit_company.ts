// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { RecruitCompany } from "../../entity/recruit_company";

type ResponseGetRecruitCompanyDetail =
    paths["/recruit-company/{recruitCompanyId}"]["get"]["responses"][200]["content"]["application/json"];

export class RecruitCompanyAPIController extends BaseAPIController {
    public async getDetail() {
        const outgoingId = this.req.params.recruitCompanyId as string;
        const recruitCompany = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompany, "rc")
                .leftJoinAndSelect("rc.info", "recruit_company_info")
                .where("rc.outgoingId = :outgoingId")
                .setParameters({
                    outgoingId: outgoingId,
                });
            return await query.getOne();
        });

        if (!recruitCompany || !recruitCompany.info) {
            this.responseNoBody(404);
            return;
        }

        const response: ResponseGetRecruitCompanyDetail = {
            id: recruitCompany.outgoingId,
            displayName: recruitCompany.info.displayName,
            establishmentYear: moment(recruitCompany.info.establishmentDate).format("YYYY"),
            establishmentMonth: moment(recruitCompany.info.establishmentDate).format("MM"),
            establishmentDay: moment(recruitCompany.info.establishmentDate).format("DD"),
            postalCode: recruitCompany.info.postalCode,
            prefectureCode: recruitCompany.info.prefectureCode,
            address: recruitCompany.info.address,
            phoneNumber: recruitCompany.info.phoneNumber,
            faxNumber: recruitCompany.info.faxNumber,
            officialSiteUrl: recruitCompany.info.officialSiteUrl,
            profile: recruitCompany.info.profile,
            employees: recruitCompany.info.employees,
            netSales: recruitCompany.info.netSales,
            contactPersonName: recruitCompany.info.contactPersonName,
            contactPersonPosition: recruitCompany.info.contactPersonPosition,
            contactPersonPhoneNumber: recruitCompany.info.contactPersonPhoneNumber,
            contactPersionMailAddress: recruitCompany.info.contactPersionMailAddress,
            updatedAtYear: moment(recruitCompany.info.updatedAt).format("YYYY"),
            updatedAtMonth: moment(recruitCompany.info.updatedAt).format("MM"),
            updatedAtDay: moment(recruitCompany.info.updatedAt).format("DD"),
        };
        this.responseJSON(response);
    }
}
