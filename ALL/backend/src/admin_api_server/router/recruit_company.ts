// -*- coding: utf-8 -*-

import { GetRecruitCompanyListAdminAPIController } from "../controller/recruit_company/get_list";
import { CreateRecruitCompanyAdminAPIController } from "../controller/recruit_company/create";
import { GetRecruitCompanyDetailAdminAPIController } from "../controller/recruit_company/get_detail";
import { UpdateRecruitCompanyAdminAPIController } from "../controller/recruit_company/update";
import { DeleteRecruitCompanyAdminAPIController } from "../controller/recruit_company/delete";
import { GetRecruitCompanyUserListAdminAPIController } from "../controller/recruit_company/get_user_list";
import { CreateRecruitCompanyUserAdminAPIController } from "../controller/recruit_company/create_user";
import { DeleteRecruitCompanyUserAdminAPIController } from "../controller/recruit_company/delete_user";
import { GetRecruitCompanyReceiveUserAdminAPIController } from "../controller/recruit_company/get_receive_user";
import { ChangeRecruitCompanyReceiveUserAdminAPIController } from "../controller/recruit_company/change_receive_user";

import { RouterConfigType } from "./define";

export const recruitCompanyRouters: RouterConfigType[] = [
    {
        path: "/v1/recruit-company",
        method: "GET",
        class: GetRecruitCompanyListAdminAPIController,
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
        path: "/v1/recruit-company/:recruitCompanyId",
        method: "GET",
        class: GetRecruitCompanyDetailAdminAPIController,
        callFunctionName: "getDetail",
        schema: {
        },
        mustRoles: ["admin", "recruitCompany"],
    },
    {
        path: "/v1/recruit-company",
        method: "POST",
        class: CreateRecruitCompanyAdminAPIController,
        callFunctionName: "create",
        schema: {
            name: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            companyTypeId: {
                in: "body",
                isInt: true,
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
        path: "/v1/recruit-company/:recruitCompanyId",
        method: "PUT",
        class: UpdateRecruitCompanyAdminAPIController,
        callFunctionName: "update",
        schema: {
            name: {
                in: "body",
                isLength: {
                    options: {
                        max: 255,
                    },
                },
            },
            companyTypeId: {
                in: "body",
                isInt: true,
            },
            beginPeriodAt: {
                in: "body",
                isISO8601: true,
            },
            endPeriodAt: {
                in: "body",
                isISO8601: true,
            },
            displayName: {
                in: "body",
                isLength: {
                    options: {
                        max: 255,
                    },
                },
            },
            establishmentDate: {
                in: "body",
                isISO8601: true,
            },
            postalCode: {
                in: "body",
                isPostalCode: {
                    options: "any",
                },
            },
            prefectureCode: {
                in: "body",
                isInt: {
                    options: {
                        min: 0,
                        max: 99,
                    },
                },
            },
            address: {
                in: "body",
                isLength: {
                    options: {
                        max: 255,
                    },
                },
            },
            phoneNumber: {
                in: "body",
                isLength: {
                    options: {
                        max: 16,
                    },
                },
            },
            faxNumber: {
                in: "body",
                isLength: {
                    options: {
                        max: 16,
                    },
                },
            },
            officialSiteUrl: {
                in: "body",
                isURL: true,
                isLength: {
                    options: {
                        max: 255,
                    },
                },
            },
            profile: {
                in: "body",
                isLength: {
                    options: {
                        max: 1024,
                    },
                },
            },
            employees: {
                in: "body",
                isLength: {
                    options: {
                        max: 64
                    },
                },
            },
            netSales: {
                in: "body",
                isLength: {
                    options: {
                        max: 64,
                    },
                },
            },
            contactPersonName: {
                in: "body",
                isLength: {
                    options: {
                        max: 64,
                    },
                },
            },
            contactPersonPosition: {
                in: "body",
                isLength: {
                    options: {
                        max: 64,
                    },
                },
            },
            contactPersonPhoneNumber: {
                in: "body",
                isLength: {
                    options: {
                        max: 16,
                    },
                },
            },
            contactPersionMailAddress: {
                in: "body",
                isEmail: true,
                isLength: {
                    options: {
                        max: 255,
                    },
                },
            },
        },
        mustRoles: ["admin", "recruitCompany"],
    },
    {
        path: "/v1/recruit-company/:recruitCompanyId",
        method: "DELETE",
        class: DeleteRecruitCompanyAdminAPIController,
        callFunctionName: "delete",
        schema: {
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/recruit-company/user/:recruitCompanyId",
        method: "GET",
        class: GetRecruitCompanyUserListAdminAPIController,
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
        path: "/v1/recruit-company/user/:recruitCompanyId",
        method: "POST",
        class: CreateRecruitCompanyUserAdminAPIController,
        callFunctionName: "createUser",
        schema: {
            mailAddress: {
                in: "body",
                isEmail: true,
            },
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/recruit-company/user/:recruitCompanyId",
        method: "DELETE",
        class: DeleteRecruitCompanyUserAdminAPIController,
        callFunctionName: "deleteUser",
        schema: {
            mailAddress: {
                in: "body",
                isEmail: true,
            },
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/recruit-company/:recruitCompanyId/receive-apply-job-user",
        method: "GET",
        class: GetRecruitCompanyReceiveUserAdminAPIController,
        callFunctionName: "getReceiveUser",
        schema: {},
        mustRoles: ["admin"],
    },
    {
        path: "/v1/recruit-company/:recruitCompanyId/receive-apply-job-user",
        method: "PUT",
        class: ChangeRecruitCompanyReceiveUserAdminAPIController,
        callFunctionName: "changeReceiveUser",
        schema: {
            userId: {
                in: "body",
                isString: true,
            },
        },
        mustRoles: ["admin"],
    },
];
