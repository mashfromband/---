// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from "typeorm";
import { nanoid } from "nanoid";

import { User } from "./user";
import { MessageRoom } from "./message_room";

export type MessageRoomUserType = "normal" | "recruitCompany";

@Entity()
export class MessageRoomPost extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 64,
        unique: true,
    })
    readonly outgoingId: string;

    @Column({
        type: "text",
    })
    readonly postBody: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => MessageRoom, (messageRoom) => messageRoom.messageRoomPosts)
    public messageRoom?: MessageRoom;

    @ManyToOne(() => User, (user) => user.messageRoomPosts)
    public postUser?: User;

    constructor(messageRoom: MessageRoom, postUser: User, postBody: string) {
        super();
        this.messageRoom = messageRoom;
        this.postUser = postUser;
        this.postBody = postBody;
        this.outgoingId = nanoid();
    }
}
