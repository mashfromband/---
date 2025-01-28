// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import { CompanyType } from "../../../entity/company_type";

export class CompanyTypeHandler {
    readonly id: number;

    constructor(id: number) {
        this.id = id;
    }

    public async load(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(CompanyType, "ct")
            .where("ct.id = :companyTypeId")
            .setParameters({
                companyTypeId: this.id,
            });
        return query.getOne();
    }
}