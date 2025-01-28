// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from "typeorm";

import { User } from "./user";
import { UserIcon } from "./user_icon";

export type ForOpenType = "close" | "businessOnly" | "open";

@Entity()
export class UserProfile extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "enum",
        enum: ["close", "businessOnly", "open"],
        default: "close",
    })
    public forOpen: ForOpenType = "close";

    @Column({
        type: "varchar",
        length: 128,
        unique: true,
    })
    public nickname!: string;

    @Column({
        type: "text",
    })
    public selfIntroduction: string = "";

    @Column({
        type: "text",
    })
    public purpose: string = "";

    @Column({
        type: "text",
    })
    public targetSkill: string = "";

    @Column({
        type: "text",
    })
    public targetKnowledge: string = "";

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    public user?: User;

    @ManyToOne(() => UserIcon, (userIcon) => userIcon.userProfiles)
    @JoinColumn()
    public userIcon?: UserIcon;

    constructor(user: User, nickname: string) {
        super();
        this.user = user;
        this.nickname = nickname;
    }
}
