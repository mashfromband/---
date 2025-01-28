// -*- coding: utf-8 -*-

import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    OneToMany,
} from "typeorm";

import { GenreCategory } from "./genre_category";
import { CategoryQuest } from "./category_quest";
import { CategoryTag } from "./category_tag";

@Entity()
export class Category extends BaseEntity {

    @PrimaryColumn({
        type: "char",
        length: 38,
    })
    readonly id: string; // SHA-224

    @Column({
        type: "varchar",
        length: 128,
    })
    public name: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    public detail: string;

    // MEMO: 循環参照が怖いのでリレーションは使用しない
    @Column({
        type: "char",
        length: 38,
        nullable: true,
    })
    public parentCategoryId: string | null = null;

    // MEMO: 循環参照が怖いのでリレーションは使用しない
    @Column({
        type: "char",
        length: 38,
        nullable: true,
    })
    public rootCategoryId: string | null = null;

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => GenreCategory, (genreCategory) => genreCategory.category)
    public genreCategories?: GenreCategory[];

    @OneToMany(() => CategoryQuest, (categoryQuest) => categoryQuest.category)
    public categoryQuests?: CategoryQuest[];

    @OneToMany(() => CategoryTag, (categoryTag) => categoryTag.category)
    public tags?: CategoryTag[];

    constructor(id: string, name: string, detail: string) {
        super();
        this.id = id;
        this.name = name;
        this.detail = detail;
    }
}
