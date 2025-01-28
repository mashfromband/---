// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../../utils/db";
import { MailAuthPasswordHash } from "./common/password_hash";
import { BaseAPIController } from "../../base";
import { CommonUserHandler } from "../../../../common/user";

import type {
    paths,
    components,
} from "../../../../types/api/auth";

type ResultType = {
    isSuccess?: boolean,
    error?: {
        status: number,
        reason: string,
    }
}

export class AuthMailLoginChangePassword extends BaseAPIController {
    public async put() {
        const currentPassword = this.req.body.currentPassword;
        const newPassword = this.req.body.newPassword;
        const confirmNewPassword = this.req.body.confirmNewPassword;

        if (newPassword !== confirmNewPassword) {
            this.responseJSON({
                reason: "新しいパスワードが一致しません",
                status: 400,
            }, 400);
            return;
        }
        const hashedPassword = await MailAuthPasswordHash.create(newPassword);

        const result: ResultType = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByUserId(manager, this.userId!, true);
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "ユーザーが存在しません",
                    },
                };
            }

            const isValidPassword = await MailAuthPasswordHash.compare(currentPassword, user.passwordHash);
            if (!isValidPassword) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 401,
                        reason: "パスワードが違います",
                    }
                }
            }

            user.passwordHash = hashedPassword;
            await manager.save(user);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
            };
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        this.responseNoBody();
    }
}
