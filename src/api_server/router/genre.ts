// -*- coding: utf-8 -*-

import { GenreAPIController } from "../controller/genre";

import { RouterConfigType } from "./define";

export const genreRouters: RouterConfigType[] = [
    {
        path: "/v1/genre/:genreId",
        method: "GET",
        class: GenreAPIController,
        callFunctionName: "getOne",
        allowNoAuccessToken: true,
    },
    {
        path: "/v1/genre",
        method: "GET",
        class: GenreAPIController,
        callFunctionName: "getList",
        allowNoAuccessToken: true,
    },
];
