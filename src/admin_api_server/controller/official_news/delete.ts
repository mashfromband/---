// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import { OfficialNews } from "../../../entity/official_new";

export class DeleteOfficialNewsAdminAPIController extends BaseAPIController {
    public async delete() {
        const officialNewsId = this.req.params.officialNewsId as string;
        let outgoingId = "";

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const getQuery = manager
                .createQueryBuilder(OfficialNews, "on")
                .where("on.id = :officialNewsId")
                .setParameters({
                    officialNewsId: officialNewsId,
                });
            const officialNews = await getQuery.getOne();
            if (!officialNews) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "存在しないおしらせです",
                    },
                };
            }

            outgoingId = officialNews.outgoingId;

            await manager.softDelete(OfficialNews, officialNews.id);
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
