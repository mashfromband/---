// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import type {
    paths,
} from "../../../types/api/management";

import { OfficialNews } from "../../../entity/official_new";

type RequestType =
    paths["/official-news/{officialNewsId}"]["put"]["requestBody"]["content"]["application/json"];

export class UpdateOfficialNewsAdminAPIController extends BaseAPIController {
    public async update() {
        const officialNewsId = this.req.params.officialNewsId as string;
        const request = this.req.body as RequestType;

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
                        reason: "存在しないお知らせです",
                    },
                };
            }

            officialNews.title = request.title;
            officialNews.detail = request.detail;
            officialNews.priority = request.priority;
            officialNews.beginPeriodAt = moment(request.beginPeriodAt, "YYYY-MM-DD").toDate();
            officialNews.endPeriodAt = moment(request.endPeriodAt, "YYYY-MM-DD").toDate();
            await manager.save(officialNews);
            await queryRunner.commitTransaction();

            return {
                officialNews: officialNews,
            };
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        this.responseNoBody(204);
    }
}
