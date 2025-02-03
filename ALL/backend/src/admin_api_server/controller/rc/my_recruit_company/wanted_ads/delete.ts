// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../../../utils/db";
import { BaseAPIController } from "../../../base";

import { RecruitCompanyWantedAds } from "../../../../../entity/recruit_company_wanted_ads";

export class DeleteMyRecruitCompanyWantedAdsAPIController extends BaseAPIController {
    public async delete() {
        const wantedAdsId = this.req.params.wantedAdsId as string;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(RecruitCompanyWantedAds, "rcwa")
                .where("rcwa.id = :wantedAdsId and rcwa.recruteCompanyId = :recruitCompanyId")
                .setParameters({
                    wantedAdsId: wantedAdsId,
                    recruitCompanyId: this.recruitCompanyId,
                })
                .setLock("pessimistic_write");
            const wantedAds = await query.getOne();

            if (!wantedAds) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "求人広告が存在しません",
                    },
                };
            }

            await manager.softDelete(RecruitCompanyWantedAds, wantedAds.id);
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
