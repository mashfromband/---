// -*- coding: utf-8 -*-

import path from "node:path";
import fs from "node:fs";

import { EntityManager } from "typeorm";
import Config from "config";

import { DBUtil } from "../../../../utils/db";
import { BaseAPIController } from "../../base";
import { CommonSimpleSendMailHandler } from "../../../../common/mail/send_mail";
import { MailAuthLoginRegistToken } from "./common/regist_token";

import { User } from "../../../../entity/user";

import type {
    paths,
    components,
} from "../../../../types/api/auth";

type RequestBody =
    paths["/auth/mail-login/temp-regist"]["post"]["requestBody"]["content"]["application/json"];
type SuccessResponse =
    paths["/auth/mail-login/temp-regist"]["post"]["responses"][200]["content"]["application/json"];

export class AuthMailLoginTempRegist extends BaseAPIController {
    public async post() {
        const request: RequestBody = this.req.body;
        const mailAddress: string = request.mailAddress;

        const isRegistedMailAddress = await this.isRegistedMailAddress(mailAddress);
        if (isRegistedMailAddress) {
            this.responseNoBody(409);
            return;
        }

        const registIns = await  MailAuthLoginRegistToken.createRegistToken("before", this.accessDate);
        const token = registIns.token;

        registIns.mailAddress = mailAddress;
        registIns.status = "before";
        await registIns.save();

        const registUrl = this.getRegistUrl(token);

        const isSendMail = Config.get("authServer.userRegist.sendMail") as boolean;
        if (isSendMail) {
            await this.sendRegistMail(mailAddress, registUrl);
        }

        const response: SuccessResponse = {
            registUrl: isSendMail ? "" : registUrl,
            expireAt: registIns.expireAt,
        };
        this.responseJSON(response);
    }

    private async isRegistedMailAddress(mailAddress: string) {
        const isRegistedMailAddress: boolean = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .where("user.mailAddress = :mailAddress and user.isValid = :isValid")
                .setParameters({
                    mailAddress: mailAddress,
                    isValid: true,
                });
            const count = await query.getCount();
            if (count > 0) {
                return true;
            }
            return false;
        });

        return isRegistedMailAddress;
    }

    private getRegistUrl(token: string) {
        const baseUrl: string = Config.get("authServer.userRegist.url");
        return baseUrl + "/" + token;
    }

    private async sendRegistMail(mailAddress: string, registUrl: string) {
        const fromAddress = "noreply@realizelearning.net"; // TODO: ちゃんとする
        const toAddressList = [mailAddress, ];
        const subject = Config.get("authServer.userRegist.mail.tempRegist.subject") as string;

        const bodyTemplate = TempRegistMailBodyStore.getMailBody();
        const body = bodyTemplate.replace("__RegistUrl__", registUrl);

        const sendMailHandler = new CommonSimpleSendMailHandler(
            toAddressList, fromAddress, subject, body,
        );
        await sendMailHandler.send();
    }
}

class TempRegistMailBodyStore {
    private static body: string = "";
    private static isLoaded: boolean = false;

    private constructor() {}

    public static getMailBody() {
        if (!this.isLoaded) {
            const filepath = path.join(process.cwd(), Config.get("authServer.userRegist.mail.tempRegist.body") as string);
            this.body = fs.readFileSync(filepath).toString();
            this.isLoaded = true;
        }

        return this.body;
    }
}
