// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import Config from "config";
import EJS from "ejs";

import { BaseAPIController } from "../../base";
import { DBUtil } from "../../../../utils/db";
import { MailAuthForgetPasswordToken } from "./common/forget_token";
import { CommonSimpleSendMailHandler } from "../../../../common/mail/send_mail";
import { CommonUserHandler } from "../../../../common/user";

import type {
    paths,
    components,
} from "../../../../types/api/auth";

type SuccessResponse =
    paths["/auth/mail-login/forget-password-url"]["post"]["responses"][200]["content"]["application/json"];

export class AuthMailLoginForgetPassword extends BaseAPIController {
    public async post() {
        const mailAddress = this.req.body.mailAddress as string;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByMailAddress(manager, mailAddress, false);
            if (!user) {
                return {
                    error: {
                        status: 404,
                        reason: "メールアドレスが登録されていません",
                    },
                };
            }

            return {
                user: user,
            };
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        const forgetPassword = await MailAuthForgetPasswordToken.createToken(this.accessDate);
        forgetPassword.userId = result.user.id;
        forgetPassword.mailAddress = mailAddress;
        await forgetPassword.save();

        const baseUrl: string = Config.get("authServer.forgetPassword.url");
        const resetPasswordUrl = baseUrl + "/" + forgetPassword.token;

        const isSendMail = Config.get("authServer.forgetPassword.sendMail") as boolean;
        if (isSendMail) {
            await this.sendResetPasswordMail(mailAddress, resetPasswordUrl);
        }

        const response: SuccessResponse = {
            url: isSendMail ? "" : resetPasswordUrl,
            expireAt: forgetPassword.expireAt,
        };
        this.responseJSON(response);
    }

    private async sendResetPasswordMail(mailAddress: string, resetPasswordUrl: string) {
        const toAddressList = [mailAddress, ];
        const fromAddress = Config.get("authServer.forgetPassword.mail.fromAddress") as string;
        const subject = Config.get("authServer.forgetPassword.mail.subject") as string;
        const templateFile = Config.get("authServer.forgetPassword.mail.templateFile") as string;
        const mailBody = await EJS.renderFile(templateFile, {
            url: resetPasswordUrl,
        });

        const sendMailHandler = new CommonSimpleSendMailHandler(
            toAddressList, fromAddress, subject, mailBody,
        );
        await sendMailHandler.send();
    }
}
