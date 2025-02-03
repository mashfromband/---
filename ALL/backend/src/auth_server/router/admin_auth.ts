// -*- coding: utf-8 -*-

import { AuthAdminMailLogin } from "../controller/auth/mail/admin/login";
import { AuthGetAdminAccessToken } from "../controller/auth/mail/admin/get_access_token";

import { RouterConfigType } from "./define";

export const adminAuthRouters: RouterConfigType[] = [
    {
        path: "/v1/admin/auth/mail-login",
        method: "POST",
        class: AuthAdminMailLogin,
        callFunctionName: "login",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/admin/auth/accessToken",
        method: "POST",
        class: AuthGetAdminAccessToken,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },
];
