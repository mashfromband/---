// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { BaseAPIController } from "../../../base";
import { DBUtil } from "../../../../../utils/db";

import { RefreshToken } from "../../../../../common/token/refresh_token";
import { AccessToken, CreateAccessTokenOptionType } from "../../../../../common/token/access_token";

import type {
    paths,
    components,
} from "../../../../../types/api/auth";
import { UserRole } from "../../../../../entity/user_role";

type SuccessResponse =
    paths["/admin/auth/accessToken"]["post"]["responses"][200]["content"]["application/json"];


export class AuthGetAdminAccessToken extends BaseAPIController {
    public async post() {
        const token = this.req.body.refreshToken;
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const ins = new RefreshToken(token);
            const refreshToken = await ins.load(manager, this.accessDate, true);
            if (!refreshToken || !refreshToken.user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 401,
                        message: "リフレッシュトークンが存在しない",
                    },
                };
            }

            if (!refreshToken.role) {
                return {
                    error: {
                        status: 401,
                        message: "リフレッシュトークンが不正な形式です",
                    },
                };
            }

            const newRefreshToken = await RefreshToken.createTokenOnly();
            refreshToken.token = newRefreshToken;
            refreshToken.expireAt = ins.getExpireAt(this.accessDate);
            refreshToken.isManagementToken = true;

            const options: CreateAccessTokenOptionType = {
                role: refreshToken.role,
            };
            if (refreshToken.recruitCompanyId) {
                options.cid = refreshToken.recruitCompanyId;
            }

            const accessToken = await AccessToken.create(
                refreshToken.user,
                this.accessDate,
                options,
            );

            await manager.save(refreshToken);
            await queryRunner.commitTransaction();

            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
            }
        });
        if (result.error) {
            this.responseNoBody(result.error.status);
            return;
        }

        const response: SuccessResponse = {
            accessToken: result.accessToken.token,
            accessTokenExpireAt: result.accessToken.expireAt,
            refreshToken: result.refreshToken.token,
            refreshTokenExpireAt: moment(result.refreshToken.expireAt).unix(),
        }
        this.responseJSON(response);
    }

    private async getUserRoles(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserRole, "userRole")
            .where("userRole.userId = :userId")
            .setParameters({
                userId: userId,
            });
        return query.getMany();
    }
}
