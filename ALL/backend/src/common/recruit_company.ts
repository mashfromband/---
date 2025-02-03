// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import { User } from "../entity/user";
import { RecruitCompany } from "../entity/recruit_company";

export class CommonRecruitCompanyHandler {
    public static async getRecruitCompanyById(manager: EntityManager, recruitComapnyId: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(RecruitCompany, "rc")
            .where("rc.id = :recruitCompanyId")
            .setParameters({
                recruitCompanyId: recruitComapnyId,
            });
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getOne();
    }

    public static async getRecruitCompanyByOutgoingId(manager: EntityManager, outgoingId: string, forUpdate: boolean) {
        const query = manager
            .createQueryBuilder(RecruitCompany, "rc")
            .where("rc.outgoingId = :outgoingId")
            .setParameters({
                outgoingId: outgoingId,
            });
        if (forUpdate) {
            query.setLock("pessimistic_write");
        }
        return query.getOne();
    }
}