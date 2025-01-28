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
import { Mission } from "./mission";

@Entity()
@Index(["mission", "tag"], { unique: true })
export class MissionTag extends BaseEntity {

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

    @ManyToOne(() => Mission, (mission) => mission.tags)
    public mission?: Mission;

    @ManyToOne(() => Tag, (tag) => tag.missionTags)
    public tag?: Tag;
}
