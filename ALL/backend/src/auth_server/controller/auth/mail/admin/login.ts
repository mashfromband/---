// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";
import moment from "moment";

import { BaseAPIController } from "../../../base";
import { DBUtil } from "../../../../../utils/db";
import { RefreshToken, RefreshTokenSaveOptions } from "../../../../../common/token/refresh_token";
import { MailAuthPasswordHash } from "../common/password_hash";
import {
    AccessToken,
    CreateAccessTokenOptionType,
} from "../../../../../common/token/access_token";

import type {
    paths,
    components,
} from "../../../../../types/api/auth";

import { User } from "../../../../../entity/user";
import { UserRole, UserRoleType } from "../../../../../entity/user_role";
import { RecruitCompany } from "../../../../../entity/recruit_company";

type RequestBody =
    paths["/admin/auth/mail-login"]["post"]["requestBody"]["content"]["application/json"];
type SuccessResponse =
    paths["/admin/auth/mail-login"]["post"]["responses"][200]["content"]["application/json"];

export class AuthAdminMailLogin extends BaseAPIController {
    public async login() {
        const mailAddress = this.req.body.mailAddress;
        const password = this.req.body.password;
        const cpcode = this.req.body.cpcode || "";

        let useRole: UserRoleType = "admin";
        let recruitCompany: RecruitCompany | null = null;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const user = await this.getUser(manager, mailAddress);
            if (!user) {
                return {
                    error: {
                        message: "メールアドレスが登録さていません",
                    },
                    status: 401,
                };
            }
            if (!user.userRoles || user.userRoles.length === 0) {
                return {
                    error: {
                        message: "権限がありません",
                    },
                    status: 403,
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

            const roles: UserRoleType[] = user.userRoles.map((v: UserRole) => v.role);
            if (roles.includes("recruitCompany") || cpcode.length > 0) {
                useRole = "recruitCompany";
                recruitCompany = await this.checkUserIncludeRecruitCompany(manager, user, cpcode);
                if (!recruitCompany) {
                    return {
                        error: {
                            message: "CPコードが違います",
                        },
                        status: 401,
                    };
                }
            }
            if (!roles.includes(useRole)) {
                return {
                    error: {
                        message: "権限がありません",
                    },
                    status: 403,
                };
            }

            const userRefreshToken = await this.createUserRefreshToken(manager, user, useRole, recruitCompany);

            return {
                user: user,
                profile: user.profile,
                roles: user.userRoles,
                refreshToken: userRefreshToken,
                status: 200,
            }
        });
        if (result.error) {
            this.responseNoBody(result.status);
            return;
        }

        const option: CreateAccessTokenOptionType = {
            role: useRole,
        };
        if (recruitCompany) {
            option.cid = (recruitCompany as RecruitCompany).id;
        }
        const resultAccessToken = await AccessToken.create(
            result.user, this.accessDate, option
        );

        const response: SuccessResponse = {
            userId: result.user.outgoingId,
            nickname: result.profile.nickname,
            mailAddress: result.user.mailAddress,
            accessToken: resultAccessToken.token!,
            accessTokenExpireAt: resultAccessToken.expireAt,
            refreshToken: result.refreshToken.token,
            refreshTokenExpireAt: moment(result.refreshToken.expireAt).unix(),
            role: useRole,
        };
        this.responseJSON(response, result.status);
    }

    private async getUser(manager: EntityManager, mailAddress: string) {
        const query = manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.profile", "userProfile")
            .leftJoinAndSelect("user.userRoles", "userRole")
            .where("user.mailAddress = :mailAddress and user.isValid = :isValid")
            .setParameters({
                mailAddress: mailAddress,
                isValid: true,
            })
        return query.getOne();
    }

    private async createUserRefreshToken(
        manager: EntityManager, user: User, useRole: UserRoleType, recruitCompany: RecruitCompany | null
    ) {
        const newUserRefreshToken = await RefreshToken.create();
        const options: RefreshTokenSaveOptions = {
            isManagementToken: true,
            role: useRole,
        }
        if (recruitCompany) {
            options.recruitCompanyId = recruitCompany.id;
        }
        return newUserRefreshToken.save(
            manager, user, this.accessDate, options
        );
    }

    private async checkUserIncludeRecruitCompany(manager: EntityManager, user: User, cpcode: string) {
        const query = manager
            .createQueryBuilder(RecruitCompany, "rc")
            .leftJoinAndSelect("rc.companyCode", "recruit_company_code")
            .leftJoinAndSelect("rc.userRecruiteCompanys", "user_recruit_company")
            .where("recruit_company_code.companyCode = :companyCode and user_recruit_company.userId = :userId")
            .setParameters({
                companyCode: cpcode,
                userId: user.id,
            });
        return query.getOne();
    }
}
