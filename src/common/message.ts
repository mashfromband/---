// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import { User } from "../entity/user";
import { MessageRoom } from "../entity/message_room";

import type {
    MessageRoomApplyJobStatus,
    MessageRoomUserType,
} from "../entity/message_room";
import { MessageRoomPost } from "../entity/message_room_post";

export type CreateMessageRoomOption = {
    owner: {
        userId: string,
        userType: MessageRoomUserType,
        recruitCompanyId?: string,
    },
    invited: {
        userId: string,
        userType: MessageRoomUserType,
        recruitCompanyId?: string,
    },
    applyJobStatus?: MessageRoomApplyJobStatus,
    recruitCompanyWantedAdsId?: string,
}

export class CommonMessageHandler {
    public static async createMessageRoom(manager: EntityManager, opts: CreateMessageRoomOption) {
        const messageRoom = new MessageRoom();

        messageRoom.ownerUserId = opts.owner.userId;
        messageRoom.ownerUserType = opts.owner.userType;
        if (opts.owner.recruitCompanyId) {
            messageRoom.ownerRecruitCompanyId = opts.owner.recruitCompanyId;
        }
        messageRoom.ownerUserLastPostId = '0';

        messageRoom.invitedUserId = opts.invited.userId;
        messageRoom.invitedUserType = opts.invited.userType;
        if (opts.invited.recruitCompanyId) {
            messageRoom.invitedRecruitCompanyId = opts.invited.recruitCompanyId;
        }
        messageRoom.invitedUserLastPostId = '0';

        if (opts.applyJobStatus) {
            messageRoom.applyJobStatus = opts.applyJobStatus;
        }
        if (opts.recruitCompanyWantedAdsId) {
            messageRoom.recruitCompanyWantedAdsId = opts.recruitCompanyWantedAdsId;
        }

        return manager.save(messageRoom);
    }

    public static async getMessageRoomById(manager: EntityManager, messageRoomId: string) {
        const query = manager
            .createQueryBuilder(MessageRoom, "mr")
            .where("mr.id = :messageRoomId")
            .setParameters({
                messageRoomId: messageRoomId,
            });
        return query.getOne();
    }

    public static async postMessage(manager: EntityManager, messageRoom: MessageRoom, user: User, body: string) {
        const messageRoomPost = new MessageRoomPost(messageRoom, user, body);
        return manager.save(messageRoomPost);
    }
}
