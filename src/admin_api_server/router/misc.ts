// -*- coding: utf-8 -*-

import { MiscAdminAPIController } from "../controller/misc";

import { RouterConfigType } from "./define";

export const miscRouters: RouterConfigType[] = [
    {
        path: "/v1/company-type",
        method: "GET",
        class: MiscAdminAPIController,
        callFunctionName: "getCompanyTypeList",
        schema: {
        },
        mustRoles: ["admin", "recruitCompany"],
    },
];
