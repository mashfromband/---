// -*- coding: utf-8 -*-

import { BaseAPIController } from "../base";

import type {
    paths,
    components,
} from "../../../types/api/auth";

export class AuthLogout extends BaseAPIController {
    public post() {
        this.responseNoBody();
    }
}
