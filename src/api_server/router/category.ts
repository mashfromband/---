// -*- coding: utf-8 -*-

import { CategoryAPIController } from "../controller/category";

import { RouterConfigType } from "./define";

export const categoryRouters: RouterConfigType[] = [
    {
        path: "/v1/category/:categoryId",
        method: "GET",
        class: CategoryAPIController,
        callFunctionName: "getOne",
        allowNoAuccessToken: true,
    },
];
