// -*- coding: utf-8 -*-

import { TagAPIController } from "../controller/tag";

import { RouterConfigType } from "./define";

export const tagRouters: RouterConfigType[] = [
    {
        path: "/v1/tag",
        method: "GET",
        class: TagAPIController,
        callFunctionName: "getList",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/tag/:tagId/quest",
        method: "GET",
        class: TagAPIController,
        callFunctionName: "getQuestListByTag",
        allowNoAuccessToken: true,
    },
];
