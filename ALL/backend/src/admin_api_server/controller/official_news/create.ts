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
    components,
} from "../../../types/api/management";
import { OfficialNews } from "../../../entity/official_new";

type RequestType =
    paths["/official-news"]["post"]["requestBody"]["content"]["application/json"];

export class CreateOfficialNewsAdminAPIController extends BaseAPIController {
    public async create() {
        const requestBody = this.req.body as RequestType;

        const officialNews = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const endPeriodAt = requestBody.endPeriodAt ? moment(requestBody.endPeriodAt, "YYYY-MM-DD").toDate() : undefined;
            const officialNews = new OfficialNews(
                requestBody.title,
                requestBody.detail,
                moment(requestBody.beginPeriodAt, "YYYY-MM-DD").toDate(),
                endPeriodAt,
            );
            officialNews.priority = requestBody.priority;
            const newOfficialNews = await manager.save(officialNews);
            await queryRunner.commitTransaction();

            return newOfficialNews;
        });

        this.responseNoBody(204);
    }
}
