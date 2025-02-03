// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { nanoid } from "nanoid";

import { GenreTag } from "./genre_tag";
import { CategoryTag } from "./category_tag";
import { QuestTag } from "./quest_tag";
import { MissionTag } from "./mission_tag";

@Entity()
export class Tag extends BaseEntity {

    @PrimaryGeneratedColumn({
        type: "bigint",
    })
    readonly id!: string;

    @Column({
        type: "varchar",
        length: 64,
        unique: true,
    })
    readonly outgoingId!: string;

    @Column({
        type: "varchar",
        length: 128,
        unique: true,
    })
    public name: string;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => GenreTag, (genreTag) => genreTag.tag)
    public genreTags?: GenreTag[];

    @OneToMany(() => CategoryTag, (categoryTag) => categoryTag.tag)
    public categoryTags?: CategoryTag[];

    @OneToMany(() => QuestTag, (questTag) => questTag.tag)
    public questTags?: QuestTag[];

    @OneToMany(() => MissionTag, (missionTag) => missionTag.tag)
    public missionTags?: MissionTag[];

    constructor(name: string) {
        super();
        this.outgoingId = nanoid();
        this.name = name;
    }
}
