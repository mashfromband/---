// -*- coding: utf-8 -*-

import { UserIconAPIController } from "../controller/user_icon";

import { RouterConfigType } from "./define";

export const userIconRouters: RouterConfigType[] = [
    {
        path: "/v1/user-icon",
        method: "GET",
        class: UserIconAPIController,
        callFunctionName: "getList",
        allowNoAuccessToken: true,
    },
];
