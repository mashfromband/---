// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    Index,
} from "typeorm";

import { Category } from "./category";
import { Quest } from "./quest";

@Entity()
@Index(["category", "quest"], { unique: true })
export class CategoryQuest extends BaseEntity {

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

    @ManyToOne(() => Category, (category) => category.categoryQuests)
    public category?: Category;

    @ManyToOne(() => Quest, (quest) => quest.categoryQuests)
    public quest?: Quest;

    constructor(category: Category, quest: Quest) {
        super();
        this.category = category;
        this.quest = quest;
    }
}
