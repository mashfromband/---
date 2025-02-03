// -*- coding: utf-8 -*-

import { OfficialNewsAPIController } from "../controller/official_news";

import { RouterConfigType } from "./define";

export const officialNewsRouters: RouterConfigType[] = [
    {
        path: "/v1/official-news",
        method: "GET",
        class: OfficialNewsAPIController,
        callFunctionName: "getSummaryList",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/official-news/:officialNewsId",
        method: "GET",
        class: OfficialNewsAPIController,
        callFunctionName: "getDetail",
        allowNoAuccessToken: true,
    },
];
