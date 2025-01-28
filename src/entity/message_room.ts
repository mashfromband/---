// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from "typeorm";
import { nanoid } from "nanoid";

import { MessageRoomPost } from "./message_room_post";

export type MessageRoomUserType = "normal" | "recruitCompany";

export type MessageRoomApplyJobStatus =
    "applyJobFromUser" | // ユーザーから求人広告に応募あり
    "offerFromRecruitCompany" | // 求人企業側からオファーあり
    "beforeDocumentScreening" | // 書類選考前
    "documentScreening" | // 書類選考中
    "beforeInterview" | // 面接前
    "afterInterview" | // 面接後
    "employment" | // 採用
    "rejection" | // 不採用
    "cancel" | // キャンセル
    "unknown"; // 不明

@Entity()
export class MessageRoom extends BaseEntity {

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
        type: "bigint",
    })
    public ownerUserId!: string;

    @Column({
        type: "enum",
        enum: [
            "normal",
            "recruitCompany",
        ],
        default: "normal",
    })
    public ownerUserType: MessageRoomUserType = "normal";

    @Column({
        type: "bigint",
        nullable: true,
    })
    public ownerRecruitCompanyId!: string | null;

    @Column({
        type: "bigint",
    })
    public ownerUserLastPostId: string = "";

    @Column({
        type: "boolean",
    })
    public ownerUserIsClose: boolean = false;

    @Column({
        type: "bigint"
    })
    public invitedUserId!: string;

    @Column({
        type: "enum",
        enum: [
            "normal",
            "recruitCompany",
        ],
        default: "normal"
    })
    public invitedUserType: MessageRoomUserType = "normal";

    @Column({
        type: "bigint",
        nullable: true,
    })
    public invitedRecruitCompanyId!: string | null;

    @Column({
        type: "bigint",
    })
    public invitedUserLastPostId: string = "";

    @Column({
        type: "boolean",
    })
    public invitedUserIsClose: boolean = false;

    @Column({
        type: "enum",
        enum: [
            "applyJobFromUser",
            "offerFromRecruitCompany",
            "beforeDocumentScreening",
            "documentScreening",
            "beforeInterview",
            "afterInterview",
            "employment",
            "rejection",
            "cancel",
            "unknown",
        ],
        nullable: true,
    })
    public applyJobStatus: MessageRoomApplyJobStatus | null = null;

    @Column({
        type: "bigint",
        nullable: true,
    })
    public recruitCompanyWantedAdsId: string | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => MessageRoomPost, (messageRoomPost) => messageRoomPost.messageRoom)
    public messageRoomPosts?: MessageRoomPost[];

    constructor() {
        super();
        this.outgoingId = nanoid();
    }
}
