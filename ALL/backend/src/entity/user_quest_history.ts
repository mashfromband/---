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
    Index,
} from "typeorm";
import { nanoid } from "nanoid";

import { User } from "./user";
import { Quest } from "./quest";

@Entity()
@Index(["createdAt"])
export class UserQuestHistory extends BaseEntity {

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
        type: "int",
    })
    public score: number;

    @Column({
        type: "boolean",
    })
    public isClear: boolean;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => User, (user) => user.questHistories)
    public user?: User;

    @ManyToOne(() => Quest, (quest) => quest.userHistories)
    public quest?: Quest;

    constructor(user: User, quest: Quest, score: number, isClear: boolean) {
        super();
        this.user = user;
        this.quest = quest;
        this.score = score;
        this.isClear = isClear;
        this.outgoingId = nanoid();
    }
}
