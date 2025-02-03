// -*- coding: utf-8 -*-

import { PostCreateRecruitCompanyWantedAdsAdminAPIController } from "../controller/wanted_ads/add";
import { GetRecruitCompanyWantedAdsDetailAdminAPIController } from "../controller/wanted_ads/get_detail";
import { GetRecruitCompanyWantedAdsListAdminAPIController } from "../controller/wanted_ads/get_list";
import { PutUpdateRecruitCompanyWantedAdsAdminAPIController } from "../controller/wanted_ads/update";
import { DeleteRecruitCompanyWantedAdsAdminAPIController } from "../controller/wanted_ads/delete";

import { RouterConfigType } from "./define";

export const wantedAdsRouters: RouterConfigType[] = [
    {
        path: "/v1/wanted-ads",
        method: "GET",
        class: GetRecruitCompanyWantedAdsListAdminAPIController,
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
        path: "/v1/wanted-ads/:wantedAdsId",
        method: "GET",
        class: GetRecruitCompanyWantedAdsDetailAdminAPIController,
        callFunctionName: "getDetail",
        schema: {
        },
        mustRoles: ["admin"],
    },
    {
        path: "/v1/wanted-ads",
        method: "POST",
        class: PostCreateRecruitCompanyWantedAdsAdminAPIController,
        callFunctionName: "create",
        schema: {
            companyId: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            title: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            beginAt: {
                in: "body",
                isISO8601: true,
            },
            endAt: {
                in: "body",
                isISO8601: true,
            },
            position: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            workLocation: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            employmentStatus: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            numberOfPeople: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 32,
                    },
                },
            },
            details: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 2048,
                    },
                },
            },
            requirements: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            salaryAndBenefits: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            officeHour: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            dayOff: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            welfareProgram: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            howToApply: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            applicationDocuments: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            applicationDeadline: {
                in: "body",
                isISO8601: true,
            },
        },
        mustRoles: ["admin", "recruitCompany"],
    },
    {
        path: "/v1/wanted-ads/:wantedAdsId",
        method: "PUT",
        class: PutUpdateRecruitCompanyWantedAdsAdminAPIController,
        callFunctionName: "update",
        schema: {
            companyId: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            title: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            beginAt: {
                in: "body",
                isISO8601: true,
            },
            endAt: {
                in: "body",
                isISO8601: true,
            },
            position: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            workLocation: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            employmentStatus: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 64,
                    },
                },
            },
            numberOfPeople: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 32,
                    },
                },
            },
            details: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 2048,
                    },
                },
            },
            requirements: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            salaryAndBenefits: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            officeHour: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            dayOff: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            welfareProgram: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            howToApply: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 128,
                    },
                },
            },
            applicationDocuments: {
                in: "body",
                isLength: {
                    options: {
                        min: 1,
                        max: 255,
                    },
                },
            },
            applicationDeadline: {
                in: "body",
                isISO8601: true,
            },
        },
        mustRoles: ["admin", "recruitCompany"],
    },
    {
        path: "/v1/wanted-ads/:wantedAdsId",
        method: "DELETE",
        class: DeleteRecruitCompanyWantedAdsAdminAPIController,
        callFunctionName: "delete",
        schema: {
        },
        mustRoles: ["admin", "recruitCompany"],
    },
];
