// -*- coding: utf-8 -*-

import { GetMyRecruitCompanyDetailAPIController } from "../../controller/rc/my_recruit_company/get_detail";
import { UpdateMyRecruitCompanyAPIController } from "../../controller/rc/my_recruit_company/update";

import { RouterConfigType } from "../define";

export const myRecruitCompanyRouters: RouterConfigType[] = [
    {
        path: "/v1/rc/my-recruit-company",
        method: "GET",
        class: GetMyRecruitCompanyDetailAPIController,
        callFunctionName: "getDetail",
        schema: {
        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/my-recruit-company",
        method: "PUT",
        class: UpdateMyRecruitCompanyAPIController,
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
        mustRoles: ["recruitCompany"],
    },
];
