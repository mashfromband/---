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
import { GenreTag } from "./genre_tag";

@Entity()
export class Genre extends BaseEntity {

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

    @CreateDateColumn()
    readonly createdAt!: Date;

    @UpdateDateColumn()
    readonly updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    readonly deletedAt: Date | null = null;

    @OneToMany(() => GenreCategory, (genreCategory) => genreCategory.genre)
    public genreCategories?: GenreCategory[];

    @OneToMany(() => GenreTag, (genreTag) => genreTag.genre)
    public tags?: GenreTag[];

    constructor(id: string, name: string, detail: string) {
        super();
        this.id = id;
        this.name = name;
        this.detail = detail;
    }
}
