// -*- coding: utf-8 -*-

import { ContactAPIController } from "../controller/contact";

import { RouterConfigType } from "./define";

export const contactRouters: RouterConfigType[] = [
    {
        path: "/v1/contact",
        method: "POST",
        class: ContactAPIController,
        callFunctionName: "postContact",
        allowNoAuccessToken: true,
    },
];
