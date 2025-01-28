// -*- coding: utf-8 -*-

import { UserAPIController } from "../controller/user";
import { UserEducationalHistoryAPIController } from "../controller/user_eductional_history";
import { UserJobHistoryAPIController } from "../controller/user_job_history";
import { UserHaveLicenseAPIController } from "../controller/user_have_license";
import { UserQuestHistoryAPIController } from "../controller/user_quest_history";
import { UserSkillAPIController } from "../controller/user_skill";
import { UserResultsAPIController } from "../controller/user_results";
import { UserEfoAPIController } from "../controller/user_efo";
import { UserRealAPIController } from "../controller/user_real";
import { UserHonorAPIController } from "../controller/user_honor";
import { UserMessageAPIController } from "../controller/user_message";
import { UserApplyJobAPIController } from "../controller/user_apply_job";

import { RouterConfigType } from "./define";

export const userRouters: RouterConfigType[] = [
    {
        path: "/v1/user/me",
        method: "GET",
        class: UserAPIController,
        callFunctionName: "getMyUserInfo",
    },
    {
        path: "/v1/user/me",
        method: "PUT",
        class: UserAPIController,
        callFunctionName: "updateMyUserInfo",
    },
    {
        path: "/v1/user/me/private-profile",
        method: "GET",
        class: UserAPIController,
        callFunctionName: "getMyUserPrivateProfile",
    },
    {
        path: "/v1/user/me/private-profile",
        method: "PUT",
        class: UserAPIController,
        callFunctionName: "updateMyUserPrivateProfile",
    },
    {
        path: "/v1/user/me/educational-history",
        method: "GET",
        class: UserEducationalHistoryAPIController,
        callFunctionName: "get",
    },
    {
        path: "/v1/user/me/educational-history",
        method: "POST",
        class: UserEducationalHistoryAPIController,
        callFunctionName: "insertHistory",
    },
    {
        path: "/v1/user/me/educational-history/:id",
        method: "PUT",
        class: UserEducationalHistoryAPIController,
        callFunctionName: "updateHistory",
    },
    {
        path: "/v1/user/me/educational-history/:id",
        method: "DELETE",
        class: UserEducationalHistoryAPIController,
        callFunctionName: "deleteHistory",
    },
    {
        path: "/v1/user/me/job-history",
        method: "GET",
        class: UserJobHistoryAPIController,
        callFunctionName: "get",
    },
    {
        path: "/v1/user/me/job-history",
        method: "POST",
        class: UserJobHistoryAPIController,
        callFunctionName: "insertHistory",
    },
    {
        path: "/v1/user/me/job-history/:id",
        method: "PUT",
        class: UserJobHistoryAPIController,
        callFunctionName: "updateHistory",
    },
    {
        path: "/v1/user/me/job-history/:id",
        method: "DELETE",
        class: UserJobHistoryAPIController,
        callFunctionName: "deleteHistory",
    },
    {
        path: "/v1/user/me/have-license",
        method: "GET",
        class: UserHaveLicenseAPIController,
        callFunctionName: "get",
    },
    {
        path: "/v1/user/me/have-license",
        method: "POST",
        class: UserHaveLicenseAPIController,
        callFunctionName: "insertLicense",
    },
    {
        path: "/v1/user/me/have-license/:id",
        method: "PUT",
        class: UserHaveLicenseAPIController,
        callFunctionName: "updateLicense",
    },
    {
        path: "/v1/user/me/have-license/:id",
        method: "DELETE",
        class: UserHaveLicenseAPIController,
        callFunctionName: "deleteLicense",
    },
    {
        path: "/v1/user/me/quest-history",
        method: "GET",
        class: UserQuestHistoryAPIController,
        callFunctionName: "getList",
    },
    {
        path: "/v1/user/me/quest-history/:userQuestHistoryId",
        method: "GET",
        class: UserQuestHistoryAPIController,
        callFunctionName: "getOne",
    },
    {
        path: "/v1/user/me/skill",
        method: "GET",
        class: UserSkillAPIController,
        callFunctionName: "getList",
    },
    {
        path: "/v1/user/me/results",
        method: "GET",
        class: UserResultsAPIController,
        callFunctionName: "getResults",
    },
    {
        path: "/v1/user/me/efo",
        method: "GET",
        class: UserEfoAPIController,
        callFunctionName: "getUserHaveEfo",
    },
    {
        path: "/v1/user/me/efo/exchange/real",
        method: "POST",
        class: UserEfoAPIController,
        callFunctionName: "exchangeReal",
    },
    {
        path: "/v1/user/me/efo/history",
        method: "GET",
        class: UserEfoAPIController,
        callFunctionName: "getUserEfoHistory",
    },
    {
        path: "/v1/user/me/efo/:transactionId",
        method: "GET",
        class: UserEfoAPIController,
        callFunctionName: "getOneUserEfoHistory",
    },
    {
        path: "/v1/user/me/real",
        method: "GET",
        class: UserRealAPIController,
        callFunctionName: "getUserHaveReal",
    },
    {
        path: "/v1/user/me/real/history",
        method: "GET",
        class: UserRealAPIController,
        callFunctionName: "getUserRealHistory",
    },
    {
        path: "/v1/user/me/real/exchange/digico",
        method: "POST",
        class: UserRealAPIController,
        callFunctionName: "postExchangeDigico",
    },
    {
        path: "/v1/user/me/real/:realId",
        method: "GET",
        class: UserRealAPIController,
        callFunctionName: "getOneUserHaveReal",
    },
    {
        path: "/v1/user/me/honor",
        method: "GET",
        class: UserHonorAPIController,
        callFunctionName: "getHonor",
    },
    {
        path: "/v1/user/me/honor",
        method: "PUT",
        class: UserHonorAPIController,
        callFunctionName: "setHonor",
    },
    {
        path: "/v1/user/me/profile/permission",
        method: "GET",
        class: UserAPIController,
        callFunctionName: "getProfilePermission",
    },
    {
        path: "/v1/user/me/profile/permission",
        method: "PUT",
        class: UserAPIController,
        callFunctionName: "changeProfilePermission",
    },
    {
        path: "/v1/user/me/message-room",
        method: "GET",
        class: UserMessageAPIController,
        callFunctionName: "getMessageRoomList",
    },
    {
        path: "/v1/user/me/message-room/:messageRoomId",
        method: "GET",
        class: UserMessageAPIController,
        callFunctionName: "getOneMessageRoom",
    },
    {
        path: "/v1/user/me/message-room/:messageRoomId",
        method: "DELETE",
        class: UserMessageAPIController,
        callFunctionName: "isCloseMessageRoom",
    },
    {
        path: "/v1/user/me/message-room/:messageRoomId/post",
        method: "GET",
        class: UserMessageAPIController,
        callFunctionName: "getMessageInMessageRoom",
    },
    {
        path: "/v1/user/me/message-room/:messageRoomId/post",
        method: "POST",
        class: UserMessageAPIController,
        callFunctionName: "postMessage",
    },
    {
        path: "/v1/user/me/apply-job/:wantedAdsId",
        method: "POST",
        class: UserApplyJobAPIController,
        callFunctionName: "applyJob",
    },
];
