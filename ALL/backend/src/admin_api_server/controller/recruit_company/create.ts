// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import { randomInt } from "node:crypto";

import { BaseAPIController } from "../base";

import type {
    paths,
    components,
} from "../../../types/api/management";
import { DBUtil } from "../../../utils/db";
import { RecruitCompanyInfo } from "../../../entity/recruit_company_info";
import { RecruitCompany } from "../../../entity/recruit_company";
import moment from "moment";
import { CompanyTypeHandler } from "./company_type";
import { CompanyType } from "../../../entity/company_type";
import { badRequestErrorResponse } from "../../error";
import { RecruitCompanyCode } from "../../../entity/recruit_company_code";

type RequestType =
    paths["/recruit-company"]["post"]["requestBody"]["content"]["application/json"];

export class CreateRecruitCompanyAdminAPIController extends BaseAPIController {
    public async create() {
        const requestBody = this.req.body as RequestType;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const companyTypeIns = new CompanyTypeHandler(requestBody.companyTypeId);
            const companyType = await companyTypeIns.load(manager);
            if (!companyType) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 400,
                        reason: "存在しない CompanyTypeId です。",
                    },
                };
            }

            const recruitCompany = new RecruitCompany(requestBody.name);
            recruitCompany.beginPeriodAt = moment(requestBody.beginPeriodAt, "YYYY-MM-DD").toDate();
            recruitCompany.endPeriodAt = moment(requestBody.endPeriodAt, "YYYY-MM-DD").toDate();
            const newRecruitCompany = await manager.save(recruitCompany);

            const recruitCompanyInfo = this.createEmptyRecruitCompanyInfo(newRecruitCompany, companyType);
            const newRecruitCompanyInfo = await manager.save(recruitCompanyInfo);

            const recruitCompanyCode = this.createRecritCompanyCode(newRecruitCompany);
            const newRecruitCompanyCode = await manager.save(recruitCompanyCode);

            await queryRunner.commitTransaction();

            return {
                recruitCompany: newRecruitCompany,
                recruitCompanyInfo: newRecruitCompanyInfo,
                recruitCompanyCode: newRecruitCompanyCode,
            };
        });

        if (result.error) {
            this.responseJSON(badRequestErrorResponse(result.error.reason), result.error.status);
        }

        this.responseNoBody(204);
    }

    private createEmptyRecruitCompanyInfo(recruitCompany: RecruitCompany, companyType: CompanyType) {
        const recruitCompanyInfo = new RecruitCompanyInfo(recruitCompany);
        recruitCompanyInfo.displayName = recruitCompany.name;
        recruitCompanyInfo.postalCode = ""
        recruitCompanyInfo.prefectureCode = 0;
        recruitCompanyInfo.address = "";
        recruitCompanyInfo.contactPersonName = "";
        recruitCompanyInfo.contactPersonPosition = "";
        recruitCompanyInfo.contactPersonPhoneNumber = "";
        recruitCompanyInfo.contactPersionMailAddress = "";
        recruitCompanyInfo.establishmentDate = moment("20000101", "YYYYMMDD").toDate();
        recruitCompanyInfo.faxNumber = "";
        recruitCompanyInfo.phoneNumber = "";
        recruitCompanyInfo.officialSiteUrl = "";
        recruitCompanyInfo.profile = "";
        recruitCompanyInfo.employees = "";
        recruitCompanyInfo.netSales = "";
        recruitCompanyInfo.companyType = companyType;
        return recruitCompanyInfo;
    }

    private createRecritCompanyCode(recruitCompany: RecruitCompany) {
        const cpcode = new RecruitCompanyCode(recruitCompany, this.generateCompanyCode());
        return cpcode;
    }

    private generateCompanyCode() {
        // MEMO: 非同期ではないのでブロックする
        const randomNum = randomInt(0, 1000000000);
        const randomStr = randomNum.toString().padStart(9, "0");
        return "CP1" + randomStr;
    }
}
