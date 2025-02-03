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
import { Category } from "./category";

@Entity()
@Index(["category", "tag"], { unique: true })
export class CategoryTag extends BaseEntity {

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

    @ManyToOne(() => Category, (category) => category.tags)
    public category?: Category;

    @ManyToOne(() => Tag, (tag) => tag.categoryTags)
    public tag?: Tag;
}
