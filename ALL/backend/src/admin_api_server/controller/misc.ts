// -*- coding: utf-8 -*-

import { BaseAPIController } from "./base";

import type {
    paths,
    components,
} from "../../types/api/management";
import { DBUtil } from "../../utils/db";
import { EntityManager } from "typeorm";
import { CompanyType } from "../../entity/company_type";

type SuccessResponseGetCompanyTypeList =
    paths["/company-type"]["get"]["responses"][200]["content"]["application/json"];
type OneCompanyType =
    components["schemas"]["oneCompanyType"];

export class MiscAdminAPIController extends BaseAPIController {
    public async getCompanyTypeList() {
        const companyTypeList = await DBUtil.getEntityManager((manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(CompanyType, "ct")
                .orderBy("id", "ASC");
            return query.getMany();
        });

        const companyTypes: OneCompanyType[] = [];
        for (const companyType of companyTypeList) {
            companyTypes.push({
                id: companyType.id,
                name: companyType.name,
            });
        }

        const response: SuccessResponseGetCompanyTypeList = {
            companyTypes: companyTypes,
        };
        this.responseJSON(response);
    }
}
