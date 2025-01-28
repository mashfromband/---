// -*- coding: utf-8 -*-

import { QuestAPIController } from "../controller/quest";
import { QuestSessionAPIController } from "../controller/quest_session";

import { RouterConfigType } from "./define";

export const questRouters: RouterConfigType[] = [
    {
        path: "/v1/quest/:questId",
        method: "GET",
        class: QuestAPIController,
        callFunctionName: "getOne",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/quest/:questId/session",
        method: "POST",
        class: QuestSessionAPIController,
        callFunctionName: "createSession",
    },
    {
        path: "/v1/quest/:questId/session/:sessionToken",
        method: "GET",
        class: QuestSessionAPIController,
        callFunctionName: "getSession",
    },
    {
        path: "/v1/quest/:questId/session/:sessionToken",
        method: "POST",
        class: QuestSessionAPIController,
        callFunctionName: "getAnswer",
    },
    {
        path: "/v1/quest/:questId/session/:sessionToken/result",
        method: "GET",
        class: QuestSessionAPIController,
        callFunctionName: "getQuestResult",
    },
    {
        path: "/v1/quest/:questId/session/:sessionToken",
        method: "DELETE",
        class: QuestSessionAPIController,
        callFunctionName: "cancelQuest",
    },
];
