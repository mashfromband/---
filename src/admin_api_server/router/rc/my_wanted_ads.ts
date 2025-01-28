// -*- coding: utf-8 -*-

import { PostCreateMyRecruitCompanyWantedAdsAPIController } from "../../controller/rc/my_recruit_company/wanted_ads/add";
import { DeleteMyRecruitCompanyWantedAdsAPIController } from "../../controller/rc/my_recruit_company/wanted_ads/delete";
import { GetMyRecruitCompanyWantedAdsDetailAPIController } from "../../controller/rc/my_recruit_company/wanted_ads/get_detail";
import { GetMyRecruitCompanyWantedAdsListAPIController } from "../../controller/rc/my_recruit_company/wanted_ads/get_list";
import { PutUpdateMyRecruitCompanyWantedAdsAPIController } from "../../controller/rc/my_recruit_company/wanted_ads/update";

import { RouterConfigType } from "../define";

export const myWantedAdsRouters: RouterConfigType[] = [
    {
        path: "/v1/rc/my-recruit-company/wanted-ads",
        method: "GET",
        class: GetMyRecruitCompanyWantedAdsListAPIController,
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
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/my-recruit-company/wanted-ads/:wantedAdsId",
        method: "GET",
        class: GetMyRecruitCompanyWantedAdsDetailAPIController,
        callFunctionName: "getDetail",
        schema: {
        },
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/my-recruit-company/wanted-ads",
        method: "POST",
        class: PostCreateMyRecruitCompanyWantedAdsAPIController,
        callFunctionName: "create",
        schema: {
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
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/my-recruit-company/wanted-ads/:wantedAdsId",
        method: "PUT",
        class: PutUpdateMyRecruitCompanyWantedAdsAPIController,
        callFunctionName: "update",
        schema: {
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
        mustRoles: ["recruitCompany"],
    },
    {
        path: "/v1/rc/my-recruit-company/wanted-ads/:wantedAdsId",
        method: "DELETE",
        class: DeleteMyRecruitCompanyWantedAdsAPIController,
        callFunctionName: "delete",
        schema: {
        },
        mustRoles: ["recruitCompany"],
    },
];
