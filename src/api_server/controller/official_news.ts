// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { OfficialNews } from "../../entity/official_new";

type ResponseGetOfficialNewsDetail =
    paths["/official-news/{officialNewsId}"]["get"]["responses"][200]["content"]["application/json"];
type ResponseGetOfficialNewsSummaryList =
    paths["/official-news"]["get"]["responses"][200]["content"]["application/json"];
type OneOfficialNewsSummary =
    components["schemas"]["oneOfficialNewsSummary"];

export class OfficialNewsAPIController extends BaseAPIController {
    public async getDetail() {
        const outgoingId = this.req.params.officialNewsId as string;

        const officialNews: OfficialNews | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(OfficialNews, "on")
                .where("on.outgoingId = :outgoingId and on.beginPeriodAt <= :now and on.endPeriodAt > :now")
                .setParameters({
                    outgoingId: outgoingId,
                    now: this.accessDate,
                });
            return await query.getOne();
        });

        if (!officialNews) {
            this.responseNoBody(404);
            return;
        }

        const response: ResponseGetOfficialNewsDetail = {
            id: officialNews.outgoingId,
            title: officialNews.title,
            detail: officialNews.detail,
            priority: officialNews.priority,
            createdAtYear: moment(officialNews.createdAt).format("YYYY"),
            createdAtMonth: moment(officialNews.createdAt).format("MM"),
            createdAtDay: moment(officialNews.createdAt).format("DD"),
            updatedAtYear: moment(officialNews.updatedAt).format("YYYY"),
            updatedAtMonth: moment(officialNews.updatedAt).format("MM"),
            updatedAtDay: moment(officialNews.updatedAt).format("DD"),
        };
        this.responseJSON(response);
    }

    public async getSummaryList() {
        const [newsList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(OfficialNews, "on")
                .where("on.beginPeriodAt <= :now and on.endPeriodAt > :now")
                .setParameters({
                    now: this.accessDate,
                });
            this.setOrderByOffsetLimit(
                query, ["id", "priority", "createdAt", "updatedAt"], "id", "on",
            );
            return query.getManyAndCount();
        });

        const responseNewsList: OneOfficialNewsSummary[] = [];
        for (const news of newsList as OfficialNews[]) {
            responseNewsList.push({
                id: news.outgoingId,
                title: news.title,
                priority: news.priority,
                createdAtYear: moment(news.createdAt).format("YYYY"),
                createdAtMonth: moment(news.createdAt).format("MM"),
                createdAtDay: moment(news.createdAt).format("DD"),
                updatedAtYear: moment(news.updatedAt).format("YYYY"),
                updatedAtMonth: moment(news.updatedAt).format("MM"),
                updatedAtDay: moment(news.updatedAt).format("DD"),
            });
        }

        const response: ResponseGetOfficialNewsSummaryList = {
            news: responseNewsList,
            total: total,
        };
        this.responseJSON(response);
    }
}
