// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../../../utils/db";
import { BaseAPIController } from "../../base";

import type {
    paths,
} from "../../../../types/api/management";

import { RecruitCompany } from "../../../../entity/recruit_company";
import { RecruitCompanyInfo } from "../../../../entity/recruit_company_info";
import { CompanyType } from "../../../../entity/company_type";

type RequestType =
    paths["/rc/my-recruit-company"]["put"]["requestBody"]["content"]["application/json"];
type SuccessResponseType =
    paths["/rc/my-recruit-company"]["put"]["responses"]["200"]["content"]["application/json"];

export class UpdateMyRecruitCompanyAPIController extends BaseAPIController {
    public async update() {
        const request = this.req.body as RequestType;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const getQuery = manager
                .createQueryBuilder(RecruitCompany, "rc")
                .leftJoinAndSelect("rc.info", "recruit_company_info")
                .leftJoinAndSelect("recruit_company_info.companyType", "company_type")
                .where("rc.id = :recruitCompanyId")
                .setParameters({
                    recruitCompanyId: this.recruitCompanyId,
                });
            const recruitCompany = await getQuery.getOne();
            if (!recruitCompany || !recruitCompany.info || !recruitCompany.info.companyType) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "存在しない企業です",
                    },
                };
            }

            const getCompanyTypeQuery = manager
                .createQueryBuilder(CompanyType, "ct")
                .where("ct.id = :companyTypeId")
                .setParameters({
                    companyTypeId: request.companyTypeId,
                });
            const companyType = await getCompanyTypeQuery.getOne();
            if (!companyType) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 400,
                        reason: "companyType が間違っています",
                    },
                };
            }

            recruitCompany.name = request.name;
            recruitCompany.beginPeriodAt = moment(request.beginPeriodAt, "YYYY-MM0-DD").toDate(),
            recruitCompany.endPeriodAt = moment(request.endPeriodAt, "YYYY-MM-DD").toDate(),
            recruitCompany.info.companyType = companyType;
            recruitCompany.info.address = request.address;
            recruitCompany.info.displayName = request.displayName;
            recruitCompany.info.contactPersionMailAddress = request.contactPersionMailAddress;
            recruitCompany.info.contactPersonName = request.contactPersonName;
            recruitCompany.info.contactPersonPhoneNumber = request.contactPersonPhoneNumber;
            recruitCompany.info.contactPersonPosition = request.contactPersonPosition;
            recruitCompany.info.employees = request.employees;
            recruitCompany.info.establishmentDate = moment(request.establishmentDate, "YYYY-MM-DD").toDate(),
            recruitCompany.info.faxNumber = request.faxNumber;
            recruitCompany.info.phoneNumber = request.phoneNumber;
            recruitCompany.info.netSales = request.netSales;
            recruitCompany.info.officialSiteUrl = request.officialSiteUrl;
            recruitCompany.info.postalCode = request.postalCode;
            recruitCompany.info.prefectureCode = request.prefectureCode;
            recruitCompany.info.profile = request.profile;

            await manager.save([recruitCompany, recruitCompany.info]);
            await queryRunner.commitTransaction();

            return {
                recruitCompany: recruitCompany,
                recruitCompanyInfo: recruitCompany.info,
            };
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        const recruitCompany = result.recruitCompany as RecruitCompany;
        const recruitCompanyInfo = result.recruitCompanyInfo as RecruitCompanyInfo;

        const response: SuccessResponseType = {
            id: recruitCompany.id,
            outgoingId: recruitCompany.outgoingId,
            name: recruitCompany.name,
            companyTypeId: recruitCompanyInfo.companyType!.id,
            beginPeriodAt: moment(recruitCompany.beginPeriodAt).format("YYYY-MM-DD"),
            endPeriodAt: moment(recruitCompany.endPeriodAt).format("YYYY-MM-DD"),
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
