// -*- coding: utf-8 -*-

import { BaseAPIController } from "../../base";
import { MailAuthLoginRegistToken } from "./common/regist_token";

import type {
    paths,
    components,
} from "../../../../types/api/auth";
import moment from "moment";

type SuccessResponse =
    paths["/auth/mail-login/regist/{token}"]["get"]["responses"][200]["content"]["application/json"];

export class AuthMailLoginCheckRegistToken extends BaseAPIController {
    public async get() {
        const token = this.req.params.token;

        const ins = new MailAuthLoginRegistToken(token);
        const isExist = await ins.load();
        if (!isExist) {
            this.responseNoBody(404);
            return;
        }

        if (ins.status === "finished") {
            const response: SuccessResponse = {
                isValid: true,
                token: ins.token,
                expireAt: ins.expireAt,
                isFinish: true,
            }
            this.responseJSON(response);
            return;
        }

        const expireDate = moment(this.accessDate).add(60, "minute").toDate(); // TODO: 外に出す
        ins.setExpireDate(expireDate);
        ins.status = "inProcess";
        await ins.save();

        const response: SuccessResponse = {
            isValid: true,
            token: ins.token,
            expireAt: ins.expireAt,
            isFinish: false,
        };
        this.responseJSON(response);
    }
}
