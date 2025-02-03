// -*- coding: utf-8 -*-

import crypto from "node:crypto";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";
import Config from "config";

import { BaseAPIController } from "../base";
import { DBUtil } from "../../../utils/db";
import { CommonUserHandler } from "../../../common/user";

import type {
    paths,
    components,
} from "../../../types/api/auth";

import { UserProfile } from "../../../entity/user_profile";
import { UserPrivateProfile } from "../../../entity/user_private_profile";
import { UserPrivateEducationalHistory } from "../../../entity/user_private_educational_history";
import { UserPrivateJobHistroy } from "../../../entity/user_private_job_history";
import { UserPrivateHaveLicense } from "../../../entity/user_private_have_license_history";
import { UserSns } from "../../../entity/user_sns";
import { UserRole } from "../../../entity/user_role";
import { UserRefreshToken } from "../../../entity/user_refresh_token";

export class AuthWithdrawal extends BaseAPIController {
    public async post() {
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByUserId(manager, this.userId!, true);
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                    },
                };
            }

            const userId = user.id;
            const outgoingId = user.outgoingId;
            const mailAddress = user.mailAddress;

            // MEMO: 並列化する?
            await this.deleteUserPrivateEducationalHistory(manager, userId);
            await this.deleteUserPrivateJobHistroy(manager, userId);
            await this.deleteUserPrivateHaveLicense(manager, userId);
            await this.deleteUserPrivateProfile(manager, userId);
            await this.deleteUserSns(manager, userId);
            await this.deleteUserRefreshToken(manager, userId);
            const nickname = await this.deleteUserProfile(manager, userId);

            await this.softDeleteUserRole(manager, userId);

            const hashedMailAddress = this.getMailAddressHash(mailAddress);

            user.mailAddress = hashedMailAddress;
            user.passwordHash = "__REMOVED__";
            user.isValid = false;
            user.withdrawaledAt = this.accessDate;
            await manager.save(user);

            await queryRunner.commitTransaction();

            return {
                withdrawalUser: {
                    userId: userId,
                    outgoingId: outgoingId,
                    mailAddress: mailAddress,
                    nickname: nickname,
                },
            };
        });

        if (result.error) {
            this.responseNoBody(result.error.status);
            return;
        }

        this.loggingInfo("user withdrawal", {
            withdrawalUser: result.withdrawalUser,
        });

        this.responseNoBody();
    }

    private getMailAddressHash(mailAddress: string) {
        const secret = Config.get("authServer.userWithdrawal.mailAddress.secret") as string;
        const hashedMailAddress = crypto.createHash("sha256").update(secret + mailAddress, "utf-8").digest("hex");
        return hashedMailAddress + "_" + moment(this.accessDate).unix().toString();
    }

    private async deleteUserProfile(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserProfile, "up")
            .where("up.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userProfile = await query.getOne();
        const nickname = userProfile?.nickname;
        if (userProfile) {
            await manager.delete(UserProfile, userProfile.id);
        }
        return nickname;
    }

    private async deleteUserPrivateProfile(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserPrivateProfile, "upp")
            .where("upp.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userPrivateProfile = await query.getOne();
        if (userPrivateProfile) {
            await manager.delete(UserPrivateProfile, userPrivateProfile.id);
        }
    }

    private async deleteUserPrivateEducationalHistory(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserPrivateEducationalHistory, "upeh")
            .where("upeh.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userPrivateEducationalHistoryList = await query.getMany();
        if (userPrivateEducationalHistoryList.length > 0) {
            await manager.delete(UserPrivateEducationalHistory, userPrivateEducationalHistoryList.map(v => v.id));
        }
    }

    private async deleteUserPrivateJobHistroy(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserPrivateJobHistroy, "upjh")
            .where("upjh.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userPrivateJobHistoryList = await query.getMany();
        if (userPrivateJobHistoryList.length > 0) {
            await manager.delete(UserPrivateJobHistroy, userPrivateJobHistoryList.map(v => v.id));
        }
    }

    private async deleteUserPrivateHaveLicense(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserPrivateHaveLicense, "uphl")
            .where("uphl.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userPrivateHaveLicenseList = await query.getMany();
        if (userPrivateHaveLicenseList.length > 0) {
            await manager.delete(UserPrivateHaveLicense, userPrivateHaveLicenseList.map(v => v.id));
        }
    }

    private async deleteUserSns(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserSns, "us")
            .where("us.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userSnsList = await query.getMany();
        if (userSnsList.length > 0) {
            await manager.delete(UserSns, userSnsList.map(v => v.id));
        }
    }

    private async deleteUserRefreshToken(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserRefreshToken, "urt")
            .where("urt.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userRefreshTokenList = await query.getMany();
        if (userRefreshTokenList.length > 0) {
            await manager.delete(UserRefreshToken, userRefreshTokenList.map(v => v.id));
        }
    }

    private async softDeleteUserRole(manager: EntityManager, userId: string) {
        const query = manager
            .createQueryBuilder(UserRole, "ur")
            .where("ur.userId = :userId")
            .setParameters({
                userId: userId,
            })
            .setLock("pessimistic_write");
        const userRoleList = await query.getMany();
        if (userRoleList.length > 0) {
            await manager.softDelete(UserRole, userRoleList.map(v => v.id));
        }
    }
}
