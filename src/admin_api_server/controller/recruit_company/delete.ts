// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import { RecruitCompany } from "../../../entity/recruit_company";
import { RecruitCompanyInfo } from "../../../entity/recruit_company_info";

export class DeleteRecruitCompanyAdminAPIController extends BaseAPIController {
    public async delete() {
        const recruitCompanyId = this.req.params.recruitCompanyId as string;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const getQuery = manager
                .createQueryBuilder(RecruitCompany, "rc")
                .leftJoinAndSelect("rc.info", "recruit_company_info")
                .where("rc.id = :recruitCompanyId")
                .setParameters({
                    recruitCompanyId: recruitCompanyId,
                });
            const recruitCompany = await getQuery.getOne();
            if (!recruitCompany || !recruitCompany.info) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "存在しない企業です",
                    },
                };
            }

            await manager.softDelete(RecruitCompanyInfo, recruitCompany.info.id);
            await manager.softDelete(RecruitCompany, recruitCompany.id);
            await queryRunner.commitTransaction();

            return {
                isDelete: true,
            };
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        this.responseNoBody(204);
    }
}
