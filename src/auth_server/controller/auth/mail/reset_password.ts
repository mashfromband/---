// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { DBUtil } from "../../../../utils/db";
import { BaseAPIController } from "../../base";
import { MailAuthForgetPasswordToken } from "./common/forget_token";
import { MailAuthPasswordHash } from "./common/password_hash";
import { CommonUserHandler } from "../../../../common/user";

import type {
    paths,
    components,
} from "../../../../types/api/auth";

export class AuthMailLoginResetPassword extends BaseAPIController {
    public async post() {
        const resetToken = this.req.body.resetToken as string;
        const password = this.req.body.password as string;
        const confirmPassword = this.req.body.confirmPassword as string;

        if (password !== confirmPassword) {
            this.responseJSON({
                status: 400,
                reason: "パスワードが一致しません",
            }, 400);
            return;
        }

        const forgetPassword = new MailAuthForgetPasswordToken(resetToken);
        const isValid = await forgetPassword.load();
        if (!isValid) {
            this.responseJSON({
                status: 404,
                reason: "制限時間を超えました",
            });
            return;
        }

        const passwordHash = await MailAuthPasswordHash.create(password);

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByUserId(manager, forgetPassword.userId!, true);
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "存在しないユーザーです",
                    },
                };
            }

            user.passwordHash = passwordHash;
            await manager.save(user);
            await queryRunner.commitTransaction();

            await forgetPassword.clear();
        });

        this.responseNoBody();
    }
}
