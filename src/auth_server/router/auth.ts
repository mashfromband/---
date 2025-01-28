// -*- coding: utf-8 -*-

import { AuthMailLoginTempRegist } from "../controller/auth/mail/temp_regist";
import { AuthMailLoginCheckRegistToken } from "../controller/auth/mail/check_regist_token";
import { AuthMailLoginRegist } from "../controller/auth/mail/regist";
import { AuthMailLogin } from "../controller/auth/mail/login";
import { AuthMailLoginChangePassword } from "../controller/auth/mail/change_password";
import { AuthMailLoginForgetPassword } from "../controller/auth/mail/forget_password";
import { AuthMailLoginResetPassword } from "../controller/auth/mail/reset_password";
import { AuthLogout } from "../controller/auth/logout";
import { AuthWithdrawal } from "../controller/auth/withdrawal";
import { AuthAccessTokenValid } from "../controller/auth/access_token_valid";
import { AuthGetAccessToken } from "../controller/auth/get_access_token";

import { RouterConfigType } from "./define";

export const authRouters: RouterConfigType[] = [
    {
        path: "/v1/auth/mail-login/temp-regist",
        method: "POST",
        class: AuthMailLoginTempRegist,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/auth/mail-login/regist/:token",
        method: "GET",
        class: AuthMailLoginCheckRegistToken,
        callFunctionName: "get",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/auth/mail-login/regist/:token",
        method: "POST",
        class: AuthMailLoginRegist,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/auth/mail-login/password",
        method: "PUT",
        class: AuthMailLoginChangePassword,
        callFunctionName: "put",
    },
    {
        path: "/v1/auth/mail-login/forget-password-url",
        method: "POST",
        class: AuthMailLoginForgetPassword,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/auth/mail-login/reset-password",
        method: "POST",
        class: AuthMailLoginResetPassword,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/auth/mail-login",
        method: "POST",
        class: AuthMailLogin,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },

    {
        path: "/v1/auth/logout",
        method: "POST",
        class: AuthLogout,
        callFunctionName: "post",
    },
    {
        path: "/v1/auth/withdrawal",
        method: "POST",
        class: AuthWithdrawal,
        callFunctionName: "post",
    },

    {
        path: "/v1/auth/accessToken/valid",
        method: "POST",
        class: AuthAccessTokenValid,
        callFunctionName: "post",
    },
    {
        path: "/v1/auth/accessToken",
        method: "POST",
        class: AuthGetAccessToken,
        callFunctionName: "post",
        allowNoAuccessToken: true,
    },

];
