// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import EJS from "ejs";
import Config from "config";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";
import { CommonSimpleSendMailHandler } from "../../common/mail/send_mail";

import { User } from "../../entity/user";

import type {
    paths,
    components,
} from "../../types/api/contents";

type PostContactFailResponse =
    paths["/contact"]["post"]["responses"][400]["content"]["application/json"];

type UserInfo = {
    userId: string;
    outgoingId: string;
    mailAddress: string;
    nickname: string;
}

export class ContactAPIController extends BaseAPIController {
    public async postContact() {
        const validateResult = this.validatePostBody();
        if (validateResult.isError) {
            const errorResponse: PostContactFailResponse = {
                reason: validateResult.reason!,
            };
            this.responseJSON(errorResponse, 400);
            return;
        }

        const userInfo: UserInfo | undefined = this.userId !== "guest" ? (await this.getUserInfo()) : undefined;
        const mailBody = await this.createMailBody(userInfo);

        const sendMail = Config.get("contact.sendMail") as boolean;
        if (sendMail) {
            const fromMailAddress = Config.get("contact.fromMailAddress") as string;
            const toMailAddress = Config.get("contact.toMailAddress") as string;
            const mailer = new CommonSimpleSendMailHandler(
                [toMailAddress,],
                fromMailAddress,
                this.req.body.subject as string,
                mailBody,
            );
            mailer.setReplayToAddresses([this.req.body.mailAddress,]);
            await mailer.send();
        }

        this.responseNoBody(204);
    }

    private async createMailBody(userInfo: UserInfo | undefined) {
        const notLogin = "<非ログイン>";
        const notInput = "<未記入>";

        const registMailAddress = userInfo ? userInfo.mailAddress : notLogin;
        const registNickname = userInfo ? userInfo.nickname : notLogin;
        const userId = userInfo ? userInfo.userId : notLogin;
        const outgoingUserId = userInfo ? userInfo.outgoingId : notLogin;

        const mailAddress: string = this.req.body.mailAddress;
        const nickname: string = this.req.body.nickname ? this.req.body.nickname : notInput;
        const subject: string = this.req.body.subject;
        const body: string = this.req.body.body;

        const srcIpAddr = this.srcIpAddress;

        const bodyList = body.split(/\r?\n/);
        const addTabBodyList = bodyList.map((v) => { return "\t" + v });
        const addTabBody = addTabBodyList.join("\n");

        const data = {
            registMailAddress: registMailAddress,
            registNickname: registNickname,
            userId: userId,
            outgoingUserId: outgoingUserId,
            mailAddress: mailAddress,
            nickname: nickname,
            subject: subject,
            srcIpAddr: srcIpAddr,
            body: addTabBody,
        };

        this.logger.info(data, "contact");

        const mailBody = await EJS.renderFile("templates/mail/contact.ejs", data);
        return mailBody;
    }

    private async getUserInfo() {
        const user = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.profile", "user_profile")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                });
            return await query.getOne();
        });

        if (!user || !user.profile) {
            return undefined;
        }
        else {
            return {
                userId: user.id,
                outgoingId: user.outgoingId,
                mailAddress: user.mailAddress,
                nickname: user.profile.nickname,
            };
        }
    }

    private validatePostBody() {
        if (!this.req.body.mailAddress) {
            return {
                isError: true,
                reason: "RequiredMailAddress",
            };
        }
        if (!this.req.body.subject) {
            return {
                isError: true,
                reason: "RequiredSubject",
            };
        }
        if (!this.req.body.body) {
            return {
                isError: true,
                reason: "RequiredBody",
            };
        }
        return {
            isError: false,
        };
    }
}
