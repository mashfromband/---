// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import moment from "moment";

import { BaseAPIController } from "../../base";
import { DBUtil } from "../../../../utils/db";
import { RefreshToken } from "../../../../common/token/refresh_token";
import { MailAuthPasswordHash } from "./common/password_hash";
import { CommonUserHandler } from "../../../../common/user";

import type {
    paths,
    components,
} from "../../../../types/api/auth";

import { User } from "../../../../entity/user";
import { AccessToken } from "../../../../common/token/access_token";
import { UserIcon } from "../../../../entity/user_icon";
import { UserProfile } from "../../../../entity/user_profile";
import { UserResults } from "../../../../entity/user_results";

type RequestBody =
    paths["/auth/mail-login"]["post"]["requestBody"]["content"]["application/json"];
type SuccessResponse =
    paths["/auth/mail-login"]["post"]["responses"][200]["content"]["application/json"];

export class AuthMailLogin extends BaseAPIController {
    public async post() {
        const mailAddress = this.req.body.mailAddress;
        const password = this.req.body.password;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByMailAddress(manager, mailAddress, false);
            if (!user) {
                return {
                    error: {
                        message: "メールアドレスが登録さていません",
                    },
                    status: 401,
                };
            }

            const passwordHash = user.passwordHash;
            const isValidPassword = await MailAuthPasswordHash.compare(password, passwordHash);
            if (!isValidPassword) {
                return {
                    error: {
                        message: "パスワードが違います",
                    },
                    status: 401,
                };
            }

            const userProfile = await this.getUserProfile(manager, user);
            if (!userProfile) {
                // MEMO: こないはずだが...
                return {
                    error: {
                        message: "メールアドレスが登録さていません",
                    },
                    status: 401,
                };
            }
            const userIcon = userProfile.userIcon ? userProfile.userIcon : await this.getDefaultUserIcon(manager);
            const userResults = await this.getUserResults(manager, user);
            const userRefreshToken = await this.createUserRefreshToken(manager, user);

            return {
                user: user,
                profile: userProfile,
                icon: userIcon,
                results: userResults,
                refreshToken: userRefreshToken,
                status: 200,
            }
        });
        if (result.error) {
            this.responseNoBody(result.status);
            return;
        }

        const resultAccessToken = await AccessToken.create(result.user, this.accessDate);

        const response: SuccessResponse = {
            userId: result.user.outgoingId,
            nickname: result.profile.nickname,
            mailAddress: result.user.mailAddress,
            accessToken: resultAccessToken.token!,
            accessTokenExpireAt: resultAccessToken.expireAt,
            refreshToken: result.refreshToken.token,
            refreshTokenExpireAt: moment(result.refreshToken.expireAt).unix(),
            level: result.results ? result.results.level : 1, // MEMO: 成績が存在しない場合は level=1
            userIconId: result.icon.id,
            userIconPath: result.icon.iconPath,
        };
        this.responseJSON(response, result.status);
    }

    private async getUserProfile(manager: EntityManager, user: User) {
        const query = manager
            .createQueryBuilder(UserProfile, "profile")
            .leftJoinAndSelect("profile.userIcon", "user_icon")
            .where("profile.userId = :userId")
            .setParameters({
                userId: user.id,
            });
        return query.getOne();
    }

    private async getUserResults(manager: EntityManager, user: User) {
        const query = manager
            .createQueryBuilder(UserResults, "results")
            .where("results.userId = :userId")
            .setParameters({
                userId: user.id,
            });
        return query.getOne();
    }

    private async getDefaultUserIcon(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserIcon, "icon")
            .where("icon.id = :iconId")
            .setParameters({
                iconId: 1,
            });
        return query.getOne();
    }

    private async createUserRefreshToken(manager: EntityManager, user: User) {
        const newUserRefreshToken = await RefreshToken.create();
        return newUserRefreshToken.save(manager, user, this.accessDate);
    }
}
