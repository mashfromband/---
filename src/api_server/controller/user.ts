// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";

import type {
    paths,
    components,
} from "../../types/api/contents";

import { User } from "../../entity/user";
import { UserProfile } from "../../entity/user_profile";
import { UserPrivateProfile } from "../../entity/user_private_profile";
import { UserIcon } from "../../entity/user_icon";

import type { ForOpenType } from "../../entity/user_profile";

type ResponseGetUserInfoByMyself =
    paths["/user/me"]["get"]["responses"][200]["content"]["application/json"];
type ResponsePutUserInfoByMyself =
    paths["/user/me"]["put"]["responses"][200]["content"]["application/json"];
type ResponseGetUserPrivateProfileByMySelf =
    paths["/user/me/private-profile"]["get"]["responses"][200]["content"]["application/json"];
type RequestPutUserPrivateProfileByMySelf =
    paths["/user/me/private-profile"]["put"]["requestBody"]["content"]["application/json"];
type ResponseGetUserProfilePermission =
    paths["/user/me/profile/permission"]["get"]["responses"][200]["content"]["application/json"];
type RequestPutUserProfilePermission =
    paths["/user/me/profile/permission"]["put"]["requestBody"]["content"]["application/json"];

export class UserAPIController extends BaseAPIController {
    public async getMyUserInfo() {
        const user = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.profile", "user_profile")
                .leftJoinAndSelect("user_profile.userIcon", "user_icon")
                .leftJoinAndSelect("user.results", "user_results")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                });
            return await query.getOne();
        });

        if (!user) {
            this.responseNoBody(404);
            return;
        }

        const response: ResponseGetUserInfoByMyself = {
            id: user.outgoingId,
            nickname: user.profile.nickname,
            mailAddress: user.mailAddress,
            selfIntroduction: user.profile.selfIntroduction,
            purpose: user.profile.purpose,
            targetSkill: user.profile.targetSkill,
            targetKnowledge: user.profile.targetKnowledge,
            userIconId: user.profile.userIcon ? user.profile.userIcon.id : 1,
            userIconPath: user.profile.userIcon ? user.profile.userIcon.iconPath : "/img/avator/preset/icon01.png", // TODO: ちゃんとする
            userLevel: user.results ? user.results.level : 1,
        };
        this.responseJSON(response);
    }

    public async updateMyUserInfo() {
        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.profile", "user_profile")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                })
                .setLock("pessimistic_write");
            const user = await query.getOne();
            if (!user || !user.profile) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "ユーザーが存在しません",
                    },
                };
            }

            const userIcon = await manager
                .createQueryBuilder(UserIcon, "ui")
                .where("ui.id = :userIconId")
                .setParameters({
                    userIconId: parseInt(this.req.body.userIconId, 10),
                })
                .getOne();
            if (!userIcon) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "ユーザーアイコンが存在しません",
                    },
                };
            }

            user.profile.nickname = this.req.body.nickname;
            user.profile.userIcon = userIcon;
            user.profile.selfIntroduction = this.req.body.selfIntroduction;
            user.profile.purpose = this.req.body.purpose;
            user.profile.targetSkill = this.req.body.targetSkill;
            user.profile.targetKnowledge = this.req.body.targetKnowledge;
            await manager.save(user.profile);
            await queryRunner.commitTransaction();

            return {
                user: user,
                profile: user.profile,
            };
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        const response: ResponsePutUserInfoByMyself = {
            id: result.user.outgoingId,
            nickname: result.user.profile.nickname,
            mailAddress: result.user.mailAddress,
            selfIntroduction: result.user.profile.selfIntroduction,
            purpose: result.user.profile.purpose,
            targetSkill: result.user.profile.targetSkill,
            targetKnowledge: result.user.profile.targetKnowledge,
            userIconId: result.user.profile.userIcon ? result.user.profile.userIcon.id : 1,
            userIconPath: result.user.profile.userIcon ? result.user.profile.userIcon.iconPath : "/img/avator/preset/icon01.png", // TODO: ちゃんとする
        };
        this.responseJSON(response);
    }

    public async getMyUserPrivateProfile() {
        const user: User | null = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.privateProfile", "user_private_profile")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                });
            return query.getOne();
        });
        if (!user || !user.privateProfile) {
            this.responseNoBody(404); // TODO: これでいいか検討する
            return;
        }

        const privateProfile = user.privateProfile;
        this.responseJSON(this.createUserPrivateProfileResponse(privateProfile));
    }

    private createUserPrivateProfileResponse(privateProfile: UserPrivateProfile) {
        const birthDay = privateProfile.birthDay ? moment(privateProfile.birthDay).format("YYYY-MM-DD") : "";
        const response: ResponseGetUserPrivateProfileByMySelf = {
            name: privateProfile.name || "",
            nameCalling: privateProfile.nameCalling || "",
            postalCode: privateProfile.postalCode || "",
            prefectureCode: privateProfile.prefectureCode || 0,
            address: privateProfile.address || "",
            addressCalling: privateProfile.addressCalling || "",
            phoneNumber: privateProfile.phoneNumber || "",
            sex: privateProfile.sex || "",
            rewardsAndPunishments: privateProfile.rewardsAndPunishments || "",
            picturePath: privateProfile.picturePath || "",
            contactPostalCode: privateProfile.contactPostalCode || "",
            contactPrefectureCode: privateProfile.contactPrefectureCode || 0,
            contactAddress: privateProfile.contactAddress || "",
            contactAddressCalling: privateProfile.contactAddressCalling || "",
            contactPhoneNumber: privateProfile.contactPhoneNumber || "",
            birthDay: birthDay,
            appealPoint: privateProfile.appealPoint || "",
            wishes: privateProfile.wishes || "",
        }
        return response;
    }

    public async updateMyUserPrivateProfile() {
        const requestBody = this.req.body as RequestPutUserPrivateProfileByMySelf;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const userPrivateProfile = await manager
                .createQueryBuilder(UserPrivateProfile, "upp")
                .where("upp.userId = :userId")
                .setParameters({
                    userId: this.userId,
                })
                .setLock("pessimistic_write")
                .getOne();
            if (!userPrivateProfile) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "データが存在しません。",
                    },
                };
            }

            const birthDay = requestBody.birthDay ? moment(requestBody.birthDay).toDate() : null;

            userPrivateProfile.name = requestBody.name;
            userPrivateProfile.nameCalling = requestBody.nameCalling;
            userPrivateProfile.postalCode = requestBody.postalCode;
            userPrivateProfile.prefectureCode = requestBody.prefectureCode;
            userPrivateProfile.address = requestBody.address;
            userPrivateProfile.addressCalling = requestBody.addressCalling;
            userPrivateProfile.phoneNumber = requestBody.phoneNumber;
            userPrivateProfile.contactPostalCode = requestBody.contactPostalCode;
            userPrivateProfile.contactPrefectureCode = requestBody.contactPrefectureCode;
            userPrivateProfile.contactAddress = requestBody.contactAddress;
            userPrivateProfile.contactAddressCalling = requestBody.contactAddressCalling;
            userPrivateProfile.contactPhoneNumber = requestBody.contactPhoneNumber;
            userPrivateProfile.appealPoint = requestBody.appealPoint;
            userPrivateProfile.wishes = requestBody.wishes;
            userPrivateProfile.birthDay = birthDay;

            await manager.save(userPrivateProfile);
            await queryRunner.commitTransaction();

            return {
                userPrivateProfile: userPrivateProfile,
            };
        });

        if (result.error) {
            this.responseJSON(
                result.error, result.error.status,
            );
            return;
        }

        this.responseJSON(this.createUserPrivateProfileResponse(result.userPrivateProfile));
    }

    public async getProfilePermission() {
        const userProfile: UserProfile = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserProfile, "user_profile")
                .select("user_profile.forOpen")
                .where("user_profile.userId = :userId", { userId: this.userId });
            return await query.getOneOrFail();
        });

        const openForRecruitCompany = userProfile.forOpen === 'close' ? false : true;
        const response: ResponseGetUserProfilePermission = {
            openForRecruitCompany: openForRecruitCompany,
        };
        this.responseJSON(response);
    }

    public async changeProfilePermission() {
        const request = this.req.body as RequestPutUserProfilePermission;
        const forOpen: ForOpenType = request.openForRecruitCompany ? "businessOnly" : "close";

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserProfile, "up")
                .where("up.userId = :userId", { userId: this.userId })
                .setLock("pessimistic_write");
            const userProfile = await query.getOneOrFail();

            if (userProfile.forOpen === forOpen) {
                await queryRunner.commitTransaction();
                return {
                    isSuccess: true,
                    isUpdated: false,
                };
            }

            userProfile.forOpen = forOpen;
            await manager.save(userProfile);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
                isUpdated: true,
            };
        });

        this.responseNoBody(204);
    }
}
