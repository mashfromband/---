// -*- coding: utf-8 -*-

import { BaseAPIController } from "./base";

import type {
    paths,
    components,
} from "../../types/api/contents";

type SuccessResponse =
    paths["/hello"]["get"]["responses"][200]["content"]["application/json"];

export class HelloAPIController extends BaseAPIController {
    public get() {
        const response: SuccessResponse = {
            message: "Hello, world!",
        };
        this.responseJSON(response);
    }
}
