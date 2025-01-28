// -*- coding: utf-8 -*-

import { RecruitCompanyAPIController } from "../controller/recruit_company";

import { RouterConfigType } from "./define";

export const recruitCompanyRouters: RouterConfigType[] = [
    {
        path: "/v1/recruit-company/:recruitCompanyId",
        method: "GET",
        class: RecruitCompanyAPIController,
        callFunctionName: "getDetail",
    },
];
