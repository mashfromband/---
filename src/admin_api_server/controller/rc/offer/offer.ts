// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { BaseAPIController } from "../../base";
import { DBUtil } from "../../../../utils/db";
import { CommonUserHandler } from "../../../../common/user";
import { CommonMessageHandler } from "../../../../common/message";

import type {
    paths,
    components,
} from "../../../../types/api/management";

import { MessageRoomPost } from "../../../../entity/message_room_post";

import type { CreateMessageRoomOption } from "../../../../common/message";

type RequestType =
    paths["/rc/offer"]["post"]["requestBody"]["content"]["application/json"];

export class RecruitCompanyOfferToUserAPIController extends BaseAPIController {
    public async sendOffer() {
        const request = this.req.body as RequestType;

        if (request.postBody.length === 0) {
            this.responseJSON({
                reason: "ポストが空です",
            }, 400);
            return;
        }
        else if (request.postBody.length > 1000) { // TODO: 外に出す
            this.responseJSON({
                reason: "ポスト上限文字数を超えています",
            }, 400);
            return;
        }

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const recruitCompanyUser = await CommonUserHandler.getUserByUserId(manager, this.userId, false);
            if (!recruitCompanyUser) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "存在しないユーザーです",
                    },
                };
            }

            const offerUser = await CommonUserHandler.getUserByUserIdWithProfile(manager, request.userId, false);
            if (!offerUser || !offerUser.profile) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "ユーザーが存在しません",
                    },
                };
            }
            if (offerUser.profile.forOpen === "close") {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 403,
                        reason: "ユーザーがプロフィールを非公開にしています",
                    },
                };
            }

            const options: CreateMessageRoomOption = {
                owner: {
                    userId: this.userId,
                    userType: "recruitCompany",
                    recruitCompanyId: this.recruitCompanyId,
                },
                invited: {
                    userId: request.userId,
                    userType: "normal",
                },
                applyJobStatus: "offerFromRecruitCompany",
            };
            const messageRoom = await CommonMessageHandler.createMessageRoom(manager, options);
            const messageRoomPost = new MessageRoomPost(messageRoom, recruitCompanyUser, request.postBody);
            await manager.save(messageRoomPost);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
                messageRoomPost: messageRoomPost,
            };
        });

        if (result.isError) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        this.responseNoBody(204);
    }
}
