// -*- coding: utf-8 -*-

import { RealEfoAPIController } from "../controller/real-efo";

import { RouterConfigType } from "./define";

export const realEfoRouters: RouterConfigType[] = [
    {
        path: "/v1/real-efo/rate",
        method: "GET",
        class: RealEfoAPIController,
        callFunctionName: "getRate",
    },
];
