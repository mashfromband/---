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

import { Genre } from "./genre";
import { Tag } from "./tag";

@Entity()
@Index(["genre", "tag"], { unique: true })
export class GenreTag extends BaseEntity {

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

    @ManyToOne(() => Genre, (genre) => genre.tags)
    public genre?: Genre;

    @ManyToOne(() => Tag, (tag) => tag.genreTags)
    public tag?: Tag;
}
