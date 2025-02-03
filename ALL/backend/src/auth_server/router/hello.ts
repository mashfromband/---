// -*- coding: utf-8 -*-

import { HelloAPIController } from "../controller/hello";

import { RouterConfigType } from "./define";

export const helloRouters: RouterConfigType[] = [
    {
        path: "/v1/hello",
        method: "GET",
        class: HelloAPIController,
        callFunctionName: "get",
        allowNoAuccessToken: true,
    },
];
