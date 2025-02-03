// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { BaseAPIController } from "../../base";
import { DBUtil } from "../../../../utils/db";
import { CommonUserHandler } from "../../../../common/user";
import { CommonRecruitCompanyHandler } from "../../../../common/recruit_company";

import type {
    paths,
    components,
} from "../../../../types/api/management";

import { MessageRoom } from "../../../../entity/message_room";
import { MessageRoomPost } from "../../../../entity/message_room_post";
import type { MessageRoomApplyJobStatus } from "../../../../entity/message_room";
import { UserRecruitCompany } from "../../../../entity/user_recruit_company";

type GetUserMessageRoomListResponse =
    paths["/rc/user/me/message-room"]["get"]["responses"]["200"]["content"]["application/json"];
type GetUserMessageRoomResponse =
    paths["/rc/user/me/message-room/{messageRoomId}"]["get"]["responses"]["200"]["content"]["application/json"];

type OneMessageRoomType =
    components["schemas"]["oneMessageRoom"];
type OneMessageRoomPostType =
    components["schemas"]["oneMessageRoomPost"];

type GetUserMessageRoomPostResponse =
    paths["/rc/user/me/message-room/{messageRoomId}/post"]["get"]["responses"]["200"]["content"]["application/json"];
type PostUserMessagePostRequest =
    paths["/rc/user/me/message-room/{messageRoomId}/post"]["post"]["requestBody"]["content"]["application/json"];

export class RecruitCompanyUserMessageAPIController extends BaseAPIController {
    public async postMessage() {
        const request = this.req.body as PostUserMessagePostRequest;
        const messageRoomId = this.req.params.messageRoomId;

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
            const user = await CommonUserHandler.getUserByUserId(manager, this.userId, false);
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "ユーザーが存在しません",
                    },
                };
            }

            const messageRoom = await this.getMessageRoom(manager, messageRoomId);
            if (!messageRoom) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            if (!this.isAllowAccessMessageRoom(messageRoom)) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 403,
                        reason: "メッセージルームへの権限がありません",
                    },
                };
            }

            const messageRoomPost = new MessageRoomPost(messageRoom, user, request.postBody);
            await manager.save(messageRoomPost);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
                messageRoomPost: messageRoomPost,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        this.responseNoBody(204);
    }

    private isAllowAccessMessageRoom(messageRoom: MessageRoom) {
        if ((messageRoom.ownerUserId !== this.userId || messageRoom.ownerUserType != "recruitCompany" || messageRoom.ownerRecruitCompanyId !== this.recruitCompanyId) &&
            (messageRoom.invitedUserId !== this.userId || messageRoom.invitedUserType != "recruitCompany" || messageRoom.invitedRecruitCompanyId !== this.recruitCompanyId)) {
            return false;
        }
        return true;
    }

    private async getMessageRoom(manager: EntityManager, messageRoomId: string) {
        const query = manager
            .createQueryBuilder(MessageRoom, "mr")
            .where("mr.outgoingId = :messageRoomId")
            .setParameters({
                messageRoomId: messageRoomId,
            });
        return query.getOne();
    }

    public async getMessageRoomList() {
        const includeCloseRoom = this.req.query.includeCloseRoom ? true : false;
        const newPostOnly = this.req.query.newPostOnly ? true : false;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(MessageRoom, "mr");

            if (includeCloseRoom) {
                query.where("(mr.ownerUserId = :userId and mr.ownerUserType = :userType and mr.ownerRecruitCompanyId = :recruitCompanyId)");
                query.orWhere("(mr.invitedUserId = :userId and mr.invitedUserType = :userType and mr.invitedRecruitCompanyId = :recruitCompanyId)");
            }
            else {
                query.where("(mr.ownerUserId = :userId and mr.ownerUserIsClose = :ownerUserIsClose and mr.ownerUserType = :userType and mr.ownerRecruitCompanyId = :recruitCompanyId)");
                query.orWhere("(mr.invitedUserId = :userId and mr.invitedUserIsClose = :invitedUserIsClose and mr.invitedUserType = :userType and mr.invitedRecruitCompanyId = :recruitCompanyId)");
            }

            if (newPostOnly) {
                query.andWhere("(mr.ownerUserId = :userId and and mr.ownerUserType = :userType and mr.ownerRecruitCompanyId = :recruitCompanyId and mr.ownerUserLastPostId < max(message_room_post.id)) or (mr.invitedUserId = :userId and mr.invitedUserType = :userType and mr.invitedRecruitCompanyId = :recruitCompanyId and mr.invitedUserLastPostId < max(message_room_post.id))");
            }

            query.setParameters({
                userId: this.userId,
                userType: "recruitCompany",
                recruitCompanyId: this.recruitCompanyId || 0, // MEMO: admin だと undefined になるのでダミーで 0 に置き換える
                ownerUserIsClose: false,
                invitedUserIsClose: false,
            });

            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "-updatedAt", "mr",
            );

            const [messageRooms, total] = await query.getManyAndCount();
            if (messageRooms.length === 0 || total === 0) {
                return {
                    messageRooms: [],
                    total: 0,
                };
            }

            const messageRoomList: OneMessageRoomType[] = [];
            for (const messageRoom of messageRooms) {
                // MEMO: もっと効率よく引けたほうがいい
                const oneMessageRoom = await this.getOneMessageRoomFromDB(manager, messageRoom);
                messageRoomList.push(oneMessageRoom);
            }

            return {
                messageRooms: messageRoomList,
                total: total,
            };
        });

        if (result.total === 0) {
            const response: GetUserMessageRoomListResponse = {
                messageRooms: [],
                total: 0,
            };
            this.responseJSON(response);
            return;
        }

        const response: GetUserMessageRoomListResponse = {
            messageRooms: result.messageRooms,
            total: result.total,
        }
        this.responseJSON(response);
    }

    private async getReceverUserApplyJobFromUser(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserRecruitCompany, "urc")
            .leftJoinAndSelect("urc.user", "user")
            .where("urc.recruteCompanyId = :recruitCompanyId and urc.receverApplyJobFromUser = :isReceived")
            .setParameters({
                recruitCompanyId: this.recruitCompanyId || 0,
                isReceived: true,
            })
            .orderBy("urc.id", "DESC")
            .limit(1);
        return query.getOne();
    }

    public async getMessageRoomListReadonly() {
        const includeCloseRoom = this.req.query.includeCloseRoom ? true : false;
        const newPostOnly = this.req.query.newPostOnly ? true : false;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const recevedUserRecruitCompany = await this.getReceverUserApplyJobFromUser(manager);
            if (!recevedUserRecruitCompany || !recevedUserRecruitCompany.user) {
                return {
                    isError: true,
                    reason: "受信ユーザーが登録されていません",
                };
            }

            const targetUser = recevedUserRecruitCompany.user;

            const query = manager
                .createQueryBuilder(MessageRoom, "mr");

            if (includeCloseRoom) {
                query.where("(mr.ownerUserId = :userId and mr.ownerUserType = :userType and mr.ownerRecruitCompanyId = :recruitCompanyId)");
                query.orWhere("(mr.invitedUserId = :userId and mr.invitedUserType = :userType and mr.invitedRecruitCompanyId = :recruitCompanyId)");
            }
            else {
                query.where("(mr.ownerUserId = :userId and mr.ownerUserIsClose = :ownerUserIsClose and mr.ownerUserType = :userType and mr.ownerRecruitCompanyId = :recruitCompanyId)");
                query.orWhere("(mr.invitedUserId = :userId and mr.invitedUserIsClose = :invitedUserIsClose and mr.invitedUserType = :userType and mr.invitedRecruitCompanyId = :recruitCompanyId)");
            }

            if (newPostOnly) {
                query.andWhere("(mr.ownerUserId = :userId and and mr.ownerUserType = :userType and mr.ownerRecruitCompanyId = :recruitCompanyId and mr.ownerUserLastPostId < max(message_room_post.id)) or (mr.invitedUserId = :userId and mr.invitedUserType = :userType and mr.invitedRecruitCompanyId = :recruitCompanyId and mr.invitedUserLastPostId < max(message_room_post.id))");
            }

            query.setParameters({
                userId: targetUser.id,
                userType: "recruitCompany",
                recruitCompanyId: this.recruitCompanyId || 0, // MEMO: admin だと undefined になるのでダミーで 0 に置き換える
                ownerUserIsClose: false,
                invitedUserIsClose: false,
            });

            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "-updatedAt", "mr",
            );

            const [messageRooms, total] = await query.getManyAndCount();
            if (messageRooms.length === 0 || total === 0) {
                return {
                    messageRooms: [],
                    total: 0,
                };
            }

            const messageRoomList: OneMessageRoomType[] = [];
            for (const messageRoom of messageRooms) {
                // MEMO: もっと効率よく引けたほうがいい
                const oneMessageRoom = await this.getOneMessageRoomFromDB(manager, messageRoom);
                messageRoomList.push(oneMessageRoom);
            }

            return {
                messageRooms: messageRoomList,
                total: total,
            };
        });

        if (result.total === 0) {
            const response: GetUserMessageRoomListResponse = {
                messageRooms: [],
                total: 0,
            };
            this.responseJSON(response);
            return;
        }

        const response: GetUserMessageRoomListResponse = {
            messageRooms: result.messageRooms,
            total: result.total,
        }
        this.responseJSON(response);
    }

    private async getOneMessageRoomFromDB(manager: EntityManager, messageRoom: MessageRoom) {
        const ownerUser = await CommonUserHandler.getUserByUserIdWithProfile(manager, messageRoom.ownerUserId, false);
        const invitedUser = await CommonUserHandler.getUserByUserIdWithProfile(manager, messageRoom.invitedUserId, false);
        const ownerRecruitCompany = await this.getRecruitCompany(manager, messageRoom.ownerRecruitCompanyId);
        const invitedRecruitCompany = await this.getRecruitCompany(manager, messageRoom.invitedRecruitCompanyId);
        const latestPost = await this.getLatestMessagePost(manager, messageRoom.id);

        const isOwner = (ownerUser && ownerUser.id === this.userId) ? true : false;
        const ownerUserId = ownerUser ? ownerUser.outgoingId : "";
        const ownerUserName = (ownerUser && ownerUser.profile) ? ownerUser.profile.nickname : "退会済み";
        const invitedUserId = invitedUser ? invitedUser.outgoingId : "";
        const invitedUserName = (invitedUser && invitedUser.profile) ? invitedUser.profile.nickname : "退会済み";
        const isClose = isOwner ? messageRoom.ownerUserIsClose : messageRoom.invitedUserIsClose;

        const isExistNewPost = () => {
            const latestPostId = isOwner ? messageRoom.ownerUserLastPostId : messageRoom.invitedUserLastPostId;
            if (latestPost && latestPost.outgoingId === latestPostId) {
                return false;
            }
            return false;
        }

        const result: OneMessageRoomType = {
            id: messageRoom.outgoingId,
            isOwner: isOwner,
            ownerUserId: ownerUser ? ownerUser.outgoingId : "",
            ownerUserType: messageRoom.ownerUserType === "normal" ? "user" : "recruitCompanyUser",
            ownerUserName: ownerUserName,
            ownerRecruitCompanyId: ownerRecruitCompany ? ownerRecruitCompany.outgoingId : undefined,
            ownerRecruitCompanyName: ownerRecruitCompany ? ownerRecruitCompany.name : undefined,

            invitedUserId: invitedUserId,
            invitedUserType: messageRoom.invitedUserType === "normal" ? "user" : "recruitCompanyUser",
            invitedUserName: invitedUserName,
            invitedRecruitCompanyId: invitedRecruitCompany ? invitedRecruitCompany.outgoingId : undefined,
            invitedRecruitCompanyName: invitedRecruitCompany ? invitedRecruitCompany.name : undefined,

            isClose: isClose,
            isNewPost: isExistNewPost(),
            latestPostUnixTime: latestPost ? moment(latestPost.createdAt).unix().toString() : '0',
            latestPost: latestPost ? this.createOneMessagePost(latestPost, ownerUserId, ownerUserName, invitedUserId, invitedUserName) : undefined,

            applyJobStatus: messageRoom.applyJobStatus || "unknown",
        };

        return result;
    }

    private async getLatestMessagePost(manager: EntityManager, messageRoomId: string) {
        const query = manager
            .createQueryBuilder(MessageRoomPost, "mrp")
            .leftJoinAndSelect("mrp.postUser", "user")
            .where("mrp.messageRoomId = :messageRoomId")
            .setParameters({
                messageRoomId: messageRoomId,
            })
            .orderBy("mrp.id", "DESC")
            .limit(1);
        return query.getOne();
    }

    private async getRecruitCompany(manager: EntityManager, recruitCompanyId: string | null) {
        if (!recruitCompanyId) {
            return null;
        }
        return CommonRecruitCompanyHandler.getRecruitCompanyById(manager, recruitCompanyId, false);
    }

    private createOneMessagePost(
        messageRoomPost: MessageRoomPost,
        ownerUserId: string, ownerUserName: string,
        invitedUserId: string, invitedUserName: string,
    ): OneMessageRoomPostType  {
        const isMe = this.isLatestMessagePostByMe(messageRoomPost);

        const getPostUserId = () => {
            if (ownerUserId === this.userId) {
                if (isMe) {
                    return ownerUserId;
                }
                else {
                    return invitedUserId;
                }
            }
            else {
                if (isMe) {
                    return invitedUserId;
                }
                else {
                    return ownerUserId;
                }
            }
        }

        const getPostUserName = () => {
            if (ownerUserId === this.userId) {
                if (isMe) {
                    return ownerUserName;
                }
                else {
                    return invitedUserName;
                }
            }
            else {
                if (isMe) {
                    return invitedUserName;
                }
                else {
                    return ownerUserName;
                }
            }
        }

        return {
            id: messageRoomPost.outgoingId,
            postUserId: getPostUserId(),
            postUserName: getPostUserName(),
            postUnixTime: moment(messageRoomPost.createdAt).unix().toString(),
            postBody: messageRoomPost.postBody,
        };
    }

    private isLatestMessagePostByMe(messageRoomPost: MessageRoomPost | null | undefined) {
        if (!messageRoomPost) {
            return false;
        }
        if (messageRoomPost.postUser?.id === this.userId) {
            return true;
        }
        else {
            return false;
        }
    }

    public async getOneMessageRoom() {
        const messageRoomId = this.req.params.messageRoomId as string;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(MessageRoom, "mr")
                .where("mr.outgoingId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoomId,
                });
            const messageRoom = await query.getOne();
            if (!messageRoom) {
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            if (!this.isAllowAccessMessageRoom(messageRoom)) {
                return {
                    isError: true,
                    error: {
                        status: 403,
                        reason: "アクセス権限がありません",
                    },
                };
            }

            const oneMessageRoom = await this.getOneMessageRoomFromDB(manager, messageRoom);
            return {
                isSuccess: true,
                messageRoom: oneMessageRoom,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        const response: GetUserMessageRoomResponse = result.messageRoom;
        this.responseJSON(response);
    }

    public async getOneMessageRoomReadonly() {
        const messageRoomId = this.req.params.messageRoomId as string;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const recevedUserRecruitCompany = await this.getReceverUserApplyJobFromUser(manager);
            if (!recevedUserRecruitCompany || !recevedUserRecruitCompany.user) {
                return {
                    isError: true,
                    reason: "受信ユーザーが登録されていません",
                };
            }

            const query = manager
                .createQueryBuilder(MessageRoom, "mr")
                .where("mr.outgoingId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoomId,
                });
            const messageRoom = await query.getOne();
            if (!messageRoom) {
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            const oneMessageRoom = await this.getOneMessageRoomFromDB(manager, messageRoom);
            return {
                isSuccess: true,
                messageRoom: oneMessageRoom,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        const response: GetUserMessageRoomResponse = result.messageRoom;
        this.responseJSON(response);

    }

    public async isCloseMessageRoom() {
        const messageRoomId = this.req.params.messageRoomId as string;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(MessageRoom, "mr")
                .where("mr.outgoingId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoomId,
                })
                .setLock("pessimistic_write");
            const messageRoom = await query.getOne();
            if (!messageRoom) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            if (!this.isAllowAccessMessageRoom(messageRoom)) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 403,
                        reason: "アクセス権限がありません",
                    },
                };
            }

            if (messageRoom.ownerUserId === this.userId) {
                messageRoom.ownerUserIsClose = true;
            }
            else if (messageRoom.invitedUserId === this.userId) {
                messageRoom.invitedUserIsClose = true;
            }

            await manager.save(messageRoom);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        this.responseNoBody(204);
    }

    public async getMessageInMessageRoom() {
        const messageRoomId = this.req.params.messageRoomId as string;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const queryGetMessageRoom = manager
                .createQueryBuilder(MessageRoom, "mr")
                .where("mr.outgoingId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoomId,
                })
                .setLock("pessimistic_write");
            const messageRoom = await queryGetMessageRoom.getOne();
            if (!messageRoom) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            if (!this.isAllowAccessMessageRoom(messageRoom)) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 403,
                        reason: "アクセス権限がありません",
                    },
                };
            }

            const queryGetMessageRoomPost = manager
                .createQueryBuilder(MessageRoomPost, "mrp")
                .leftJoinAndSelect("mrp.postUser", "user")
                .leftJoinAndSelect("user.profile", "user_profile", "user.id = user_profile.userId")
                .where("mrp.messageRoomId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoom.id,
                });

            this.setOrderByOffsetLimit(
                queryGetMessageRoomPost, ["id", "createdAt", "updatedAt"], "-id", "mrp",
            );

            const [messageRoomPosts, total] = await queryGetMessageRoomPost.getManyAndCount();
            if (messageRoomPosts.length === 0 || total === 0) {
                await queryRunner.commitTransaction();
                return {
                    isSuccess: true,
                    messageRoomPosts: [],
                    total: 0,
                };
            }

            let latestMessageRoomPostId: bigint = 0n;
            for (const messageRoomPost of messageRoomPosts) {
                const messageRoomPostId = BigInt(messageRoomPost.id);
                if (latestMessageRoomPostId < messageRoomPostId) {
                    latestMessageRoomPostId = messageRoomPostId;
                }
            }

            if (messageRoom.ownerUserId === this.userId) {
                messageRoom.ownerUserLastPostId = latestMessageRoomPostId.toString();
            }
            else if (messageRoom.invitedUserId === this.userId) {
                messageRoom.invitedUserLastPostId = latestMessageRoomPostId.toString();
            }

            await manager.save(messageRoom);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
                messageRoomPosts: messageRoomPosts,
                total: total,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        const messageRoomPostList: OneMessageRoomPostType[] = [];
        for (const messageRoomPost of result.messageRoomPosts as MessageRoomPost[]) {
            messageRoomPostList.push({
                id: messageRoomPost.outgoingId,
                postUserId: messageRoomPost.postUser ? messageRoomPost.postUser.outgoingId : "",
                postUserName: (messageRoomPost.postUser && messageRoomPost.postUser.profile) ? messageRoomPost.postUser.profile.nickname : "退会済み",
                postUnixTime: moment(messageRoomPost.createdAt).unix().toString(),
                postBody: messageRoomPost.postBody,
            });
        }

        const response: GetUserMessageRoomPostResponse = {
            posts: messageRoomPostList,
            total: result.total,
        };
        this.responseJSON(response);
    }

    public async getMessageInMessageRoomReadonly() {
        const messageRoomId = this.req.params.messageRoomId as string;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const recevedUserRecruitCompany = await this.getReceverUserApplyJobFromUser(manager);
            if (!recevedUserRecruitCompany || !recevedUserRecruitCompany.user) {
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "受信ユーザーが登録されていません",
                    },
                };
            }

            const queryGetMessageRoom = manager
                .createQueryBuilder(MessageRoom, "mr")
                .where("mr.outgoingId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoomId,
                });
            const messageRoom = await queryGetMessageRoom.getOne();
            if (!messageRoom) {
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            const queryGetMessageRoomPost = manager
                .createQueryBuilder(MessageRoomPost, "mrp")
                .leftJoinAndSelect("mrp.postUser", "user")
                .leftJoinAndSelect("user.profile", "user_profile", "user.id = user_profile.userId")
                .where("mrp.messageRoomId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoom.id,
                });

            this.setOrderByOffsetLimit(
                queryGetMessageRoomPost, ["id", "createdAt", "updatedAt"], "-id", "mrp",
            );

            const [messageRoomPosts, total] = await queryGetMessageRoomPost.getManyAndCount();
            if (messageRoomPosts.length === 0 || total === 0) {
                return {
                    isSuccess: true,
                    messageRoomPosts: [],
                    total: 0,
                };
            }

            let latestMessageRoomPostId: bigint = 0n;
            for (const messageRoomPost of messageRoomPosts) {
                const messageRoomPostId = BigInt(messageRoomPost.id);
                if (latestMessageRoomPostId < messageRoomPostId) {
                    latestMessageRoomPostId = messageRoomPostId;
                }
            }

            return {
                isSuccess: true,
                messageRoomPosts: messageRoomPosts,
                total: total,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        const messageRoomPostList: OneMessageRoomPostType[] = [];
        for (const messageRoomPost of result.messageRoomPosts as MessageRoomPost[]) {
            messageRoomPostList.push({
                id: messageRoomPost.outgoingId,
                postUserId: messageRoomPost.postUser ? messageRoomPost.postUser.outgoingId : "",
                postUserName: (messageRoomPost.postUser && messageRoomPost.postUser.profile) ? messageRoomPost.postUser.profile.nickname : "退会済み",
                postUnixTime: moment(messageRoomPost.createdAt).unix().toString(),
                postBody: messageRoomPost.postBody,
            });
        }

        const response: GetUserMessageRoomPostResponse = {
            posts: messageRoomPostList,
            total: result.total,
        };
        this.responseJSON(response);
    }

    public async changeApplyJobStatus() {
        const messageRoomId = this.req.params.messageRoomId as string;
        const applyJobStatus = this.req.body.applyJobStatus as MessageRoomApplyJobStatus;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(MessageRoom, "mr")
                .where("mr.outgoingId = :messageRoomId")
                .setParameters({
                    messageRoomId: messageRoomId,
                })
                .setLock("pessimistic_write");
            const messageRoom = await query.getOne();
            if (!messageRoom) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "メッセージルームが存在しません",
                    },
                };
            }

            if (!this.isAllowAccessMessageRoom(messageRoom)) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 403,
                        reason: "アクセス権限がありません",
                    },
                };
            }

            messageRoom.applyJobStatus = applyJobStatus;

            await manager.save(messageRoom);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        this.responseNoBody(204);

    }
}
