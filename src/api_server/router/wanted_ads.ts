// -*- coding: utf-8 -*-

import { WantedAdsAPIController } from "../controller/wanted_ads";

import { RouterConfigType } from "./define";

export const wantedAdsRouters: RouterConfigType[] = [
    {
        path: "/v1/wanted-ads/:wantedAdsId",
        method: "GET",
        class: WantedAdsAPIController,
        callFunctionName: "getDetail",
    },
    {
        path: "/v1/wanted-ads",
        method: "GET",
        class: WantedAdsAPIController,
        callFunctionName: "getSummaryList",
    },
];
