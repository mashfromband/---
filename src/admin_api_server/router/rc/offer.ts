// -*- coding: utf-8 -*-

import { RecruitCompanyOfferToUserAPIController } from "../../controller/rc/offer/offer";

import { RouterConfigType } from "../define";

export const offerRouters: RouterConfigType[] = [
    {
        path: "/v1/rc/offer",
        method: "POST",
        class: RecruitCompanyOfferToUserAPIController,
        callFunctionName: "sendOffer",
        schema: {
            userId: {
                in: "body",
                isString: true,
            },
            postBody: {
                in: "body",
                isString: {
                    max: 1000,
                },
            },
        },
        mustRoles: ["recruitCompany"],
    },
];
