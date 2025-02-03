// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";
import Config from "config";

import { DBUtil } from "../../../../utils/db";
import { BaseAPIController } from "../../base";

import { MailAuthPasswordHash } from "./common/password_hash";
import { MailAuthLoginRegistToken } from "./common/regist_token";
import { AccessToken } from "../../../../common/token/access_token";
import { RefreshToken } from "../../../../common/token/refresh_token";

import type {
    paths,
    components,
} from "../../../../types/api/auth";

import { User } from "../../../../entity/user";
import { UserProfile } from "../../../../entity/user_profile";
import { Term } from "../../../../entity/term";
import { UserAgreementTerm } from "../../../../entity/user_agreement_term";
import { UserPrivateProfile } from "../../../../entity/user_private_profile";

type RequestBody =
    paths["/auth/mail-login/regist/{token}"]["post"]["requestBody"]["content"]["application/json"];
type SuccessResponse =
    paths["/auth/mail-login/regist/{token}"]["post"]["responses"][200]["content"]["application/json"];

export class AuthMailLoginRegist extends BaseAPIController {
    public async post() {
        const request: RequestBody = this.req.body;
        const password = request.password;
        const nickname = request.nickname;
        const agreeTerm = request.agreeTerm;
        const agreePrivacy = request.agreePrivacy;
        const token = this.req.params.token;

        const hashedPassword = await MailAuthPasswordHash.create(password);

        const registTokenIns = new MailAuthLoginRegistToken(token);
        const isExist = await registTokenIns.load();
        if (!isExist) {
            this.responseNoBody(404);
            return;
        }

        if (registTokenIns.status === "finished") {
            const response: SuccessResponse = {
                userId: "",
                nickname: "",
                accessToken: "",
                accessTokenExpireAt: 0,
                refreshToken: "",
                refreshTokenExpireAt: 0,
                isFinish: true,
            };
            this.responseJSON(response);
            return;
        }

        const mailAddress = registTokenIns.mailAddress;
        if (!mailAddress) {
            this.responseNoBody(404);
            return;
        }

        if (!agreeTerm || !agreePrivacy) {
            // TODO: ちゃんとする
            this.responseNoBody(400);
            return;
        }

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            if (!(await this.isNotExistMailAddress(manager, mailAddress))) {
                await queryRunner.rollbackTransaction();
                this.responseJSON({
                    error: {
                        message: "すでに登録済みのメールアドレスです",
                    },
                }, 400);
                return false;
            }

            const user = await this.createNewUser(manager, mailAddress, hashedPassword);
            const userProfile = await this.createUserProfile(manager, user, nickname);
            const userPrivateProfile = await this.createUserPrivateProfile(manager, user);
            const userRefreshToken = await this.createUserRefreshToken(manager, user);
            const userAgreementTerms = await this.createUserAgreementTerm(manager, user);

            await queryRunner.commitTransaction();

            registTokenIns.status = "finished";
            const expireSec: number = Config.get("authServer.userRegist.token.expireSec");
            registTokenIns.setExpireDate(moment(this.accessDate).unix() + expireSec);
            await registTokenIns.save();

            return {
                user: user,
                profile: userProfile,
                privateProfile: userPrivateProfile,
                refreshToken: userRefreshToken,
                agreementTerms: userAgreementTerms,
            };
        });
        if (!result) {
            return;
        }

        const resultAccessToken = await AccessToken.create(result.user, this.accessDate);

        const response: SuccessResponse = {
            userId: result.user.outgoingId,
            nickname: result.profile.nickname,
            accessToken: resultAccessToken.token!,
            accessTokenExpireAt: resultAccessToken.expireAt,
            refreshToken: result.refreshToken.token,
            refreshTokenExpireAt: moment(result.refreshToken.expireAt).unix(),
            isFinish: false,
        };
        this.responseJSON(response);
    }

    private async createUserAgreementTerm(manager: EntityManager, user: User) {
        const allTerms = await manager
            .createQueryBuilder(Term, "term")
            .getMany();
        const userAgreementTermList: UserAgreementTerm[] = [];
        for (const term of allTerms) {
            const agreeTerm = new UserAgreementTerm(user, term, this.accessDate, term.currentVersion);
            userAgreementTermList.push(agreeTerm);
        }
        return await manager.save(userAgreementTermList);
    }

    private async createNewUser(manager: EntityManager, mailAddress: string, passwordHash: string) {
        const newUser = new User(mailAddress, passwordHash);
        return await manager.save(newUser);
    }

    private async createUserProfile(manager: EntityManager, user: User, nickname: string) {
        const newUserProfile = new UserProfile(user, nickname);
        return await manager.save(newUserProfile);
    }

    private async createUserPrivateProfile(manager: EntityManager, user: User) {
        const newUserPrivateProfile = new UserPrivateProfile(user);
        return await manager.save(newUserPrivateProfile);
    }

    private async createUserRefreshToken(manager: EntityManager, user: User) {
        const newUserRefreshToken = await RefreshToken.create();
        return await newUserRefreshToken.save(manager, user, this.accessDate);
    }

    private async isNotExistMailAddress(manager: EntityManager, mailAddress: string) {
        const query = manager
            .createQueryBuilder(User, "user")
            .where("user.mailAddress = :mailAddress and user.isValid = :isValid")
            .setParameters({
                mailAddress: mailAddress,
                isValid: true,
            });
        const count = await query.getCount();
        if (count > 0) {
            return false;
        }
        return true;
    }
}
