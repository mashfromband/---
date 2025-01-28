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

import { Genre } from "./genre";
import { Category } from "./category";

@Entity()
@Index(["genre", "category"], { unique: true })
export class GenreCategory extends BaseEntity {

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

    @ManyToOne(() => Genre, (genre) => genre.genreCategories)
    public genre?: Genre;

    @ManyToOne(() => Category, (category) => category.genreCategories)
    public category?: Category;

    constructor(genre: Genre, category: Category) {
        super();
        this.genre = genre;
        this.category = category;
    }
}
