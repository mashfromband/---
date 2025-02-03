// -*- coding: utf-8 -*-

import { RecruitCompanyUserMessageAPIController } from "../../controller/rc/message/message";

import { RouterConfigType } from "../define";

export const messageRouters: RouterConfigType[] = [
    {
        path: "/v1/rc/user/me/message-room",
        method: "GET",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "getMessageRoomList",
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
                in: "query",
                optional: true,
                isString: true,
            },
            includeCloseRoom: {
                in: "query",
                optional: true,
                isString: true,
            },
            newPostOnly: {
                in: "query",
                optional: true,
                isString: true,
            },
        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/user/me/message-room/:messageRoomId",
        method: "GET",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "getOneMessageRoom",
        schema: {},
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/user/me/message-room/:messageRoomId",
        method: "DELETE",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "isCloseMessageRoom",
        schema: {},
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/user/me/message-room/:messageRoomId/post",
        method: "GET",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "getMessageInMessageRoom",
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
                in: "query",
                optional: true,
                isString: true,
            },

        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/user/me/message-room/:messageRoomId/post",
        method: "POST",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "postMessage",
        schema: {
            postBody: {
                in: "body",
                isString: {
                    min: 1,
                    max: 1000,
                },
            },
        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/user/me/message-room/:messageRoomId/status",
        method: "PUT",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "changeApplyJobStatus",
        schema: {
            applyJobStatus: {
                in: "body",
                isString: true,
            },
        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/apply-for-job/message-room/readonly",
        method: "GET",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "getMessageRoomListReadonly",
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
                in: "query",
                optional: true,
                isString: true,
            },
            includeCloseRoom: {
                in: "query",
                optional: true,
                isString: true,
            },
            newPostOnly: {
                in: "query",
                optional: true,
                isString: true,
            },
        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/apply-for-job/message-room/:messageRoomId/post/readonly",
        method: "GET",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "getMessageInMessageRoomReadonly",
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
                in: "query",
                optional: true,
                isString: true,
            },

        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/apply-for-job/message-room/:messageRoomId/readonly",
        method: "GET",
        class: RecruitCompanyUserMessageAPIController,
        callFunctionName: "getOneMessageRoomReadonly",
        schema: {},
        mustRoles: ["recruitCompany"],
    },
];
