// -*- coding: utf-8 -*-

import { CreateOfficialNewsAdminAPIController } from "../controller/official_news/create";
import { DeleteOfficialNewsAdminAPIController } from "../controller/official_news/delete";
import { GetOfficialNewsDetailAdminAPIController } from "../controller/official_news/get_detail";
import { GetOfficialNewsSummaryListAdminAPIController } from "../controller/official_news/get_list";
import { UpdateOfficialNewsAdminAPIController } from "../controller/official_news/update";

import { RouterConfigType } from "./define";

export const officialNewsRouters: RouterConfigType[] = [
    {
        path: "/v1/official-news",
        method: "GET",
        class: GetOfficialNewsSummaryListAdminAPIController,
        callFunctionName: "getList",
        schema: {
            limit: {
                optional: true,
                in: "query",
                isInt: {
                    min: 1,
                    max: 100,
                },
            },
            offset: {
                optional: true,
                in: "query",
                isInt: {
                    min: 0,
                },
            },
            sort: {
                optional: true,
                isString: true,
            },
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/official-news/:officialNewsId",
        method: "GET",
        class: GetOfficialNewsDetailAdminAPIController,
        callFunctionName: "getDetail",
        schema: {
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/official-news",
        method: "POST",
        class: CreateOfficialNewsAdminAPIController,
        callFunctionName: "create",
        schema: {
            title: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            detail: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 4096,
                    },
                },
            },
            priority: {
                in: "body",
                isInt: {
                    options: {
                        min: 1,
                        max: 100,
                    },
                },
            },
            beginPeriodAt: {
                in: "body",
                isISO8601: true,
            },
            endPeriodAt: {
                in: "body",
                isISO8601: true,
            },
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/official-news/:officialNewsId",
        method: "PUT",
        class: UpdateOfficialNewsAdminAPIController,
        callFunctionName: "update",
        schema: {
            title: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            detail: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 4096,
                    },
                },
            },
            priority: {
                in: "body",
                isInt: {
                    options: {
                        min: 1,
                        max: 100,
                    },
                },
            },
            beginPeriodAt: {
                in: "body",
                isISO8601: true,
            },
            endPeriodAt: {
                in: "body",
                isISO8601: true,
            },
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/official-news/:officialNewsId",
        method: "DELETE",
        class: DeleteOfficialNewsAdminAPIController,
        callFunctionName: "delete",
        schema: {
        },
        mustRoles: ["admin"],
    },
];
