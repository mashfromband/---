// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../../utils/db";
import { BaseAPIController } from "../base";

import type {
    paths,
    components,
} from "../../../types/api/management";

import { OfficialNews } from "../../../entity/official_new";

type SuccessResponseType =
    paths["/official-news/{officialNewsId}"]["get"]["responses"]["200"]["content"]["application/json"];

export class GetOfficialNewsDetailAdminAPIController extends BaseAPIController {
    public async getDetail() {
        const officialnewsId = this.req.params.officialNewsId as string;

        const news: OfficialNews | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(OfficialNews, "on")
                .where("on.id = :officialnewsId")
                .setParameters({
                    officialnewsId: officialnewsId,
                });
            return query.getOne();
        });

        if (!news) {
            this.responseNoBody(404);
            return;
        }

        const response: SuccessResponseType = {
            id: news.id,
            outgoingId: news.outgoingId,
            title: news.title,
            detail: news.detail,
            priority: news.priority,
            beginPeriodAt: moment(news.beginPeriodAt).format("YYYY-MM-DD"),
            endPeriodAt: moment(news.endPeriodAt).format("YYYY-MM-DD"),
            createdAt: moment(news.createdAt).format("YYYY-MM-DD"),
            updatedAt: moment(news.updatedAt).format("YYY-MM-DD"),
        };
        this.responseJSON(response);
    }
}
