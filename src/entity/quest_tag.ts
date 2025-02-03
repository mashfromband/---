// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    Index,
} from "typeorm";

import { Tag } from "./tag";
import { Quest } from "./quest";

@Entity()
@Index(["quest", "tag"], { unique: true })
export class QuestTag extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @ManyToOne(() => Quest, (quest) => quest.tags)
    public quest?: Quest;

    @ManyToOne(() => Tag, (tag) => tag.questTags)
    public tag?: Tag;
}
