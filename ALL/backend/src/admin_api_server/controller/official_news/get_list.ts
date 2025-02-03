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

type ResponseType =
    paths["/official-news"]["get"]["responses"]["200"]["content"]["application/json"];
type OneNewsType =
    components["schemas"]["oneOfficialNewsSummary"];

export class GetOfficialNewsSummaryListAdminAPIController extends BaseAPIController {
    public async getList() {
        const [newsList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(OfficialNews, "on");
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "on"
            );
            return query.getManyAndCount();
        });

        const responseList: OneNewsType[] = [];
        for (const news of newsList as OfficialNews[]) {
            responseList.push({
                id: news.id,
                outgoingId: news.outgoingId,
                title: news.title,
                priority: news.priority,
                beginPeriodAt: moment(news.beginPeriodAt).format("YYYY-MM-DD"),
                endPeriodAt: moment(news.endPeriodAt).format("YYYY-MM-DD"),
                createdAt: moment(news.createdAt).format("YYYY-MM-DD"),
                updatedAt: moment(news.updatedAt).format("YYYY-MM-DD"),
            });
        }

        const response: ResponseType = {
            news: responseList,
            total: total as number,
        }
        this.responseJSON(response);
    }
}
