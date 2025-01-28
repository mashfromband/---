// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import type { GenreTypeInJson } from "./genre";

import { Genre } from "../../entity/genre";
import { Category } from "../../entity/category";
import { GenreCategory } from "../../entity/genre_category";
import { getHash } from "./hash";

// TODO: 外に出す
const genreFilePath = path.join(process.cwd(), "master_data", "question", "genre.json");

const upsertGenreCategory = async (manager: EntityManager, childCategoryDict: {[key: string]: string[]}) => {
    console.log("[GENRE] <BEGIN> 子カテゴリ登録開始");

    for (const genreId of Object.keys(childCategoryDict)) {
        if (childCategoryDict[genreId].length === 0) {
            console.warn("[GENRE] childCategories が存在しません genre=" + genreId);
            continue;
        }

        const genre = await manager
            .createQueryBuilder(Genre, "genre")
            .where("genre.id = :genreId")
            .setParameters({
                genreId: genreId,
            })
            .getOneOrFail();

        const categoryList = await manager
            .createQueryBuilder(Category, "ct")
            .where("ct.id in (:categoryIdList)")
            .setParameters({
                categoryIdList: childCategoryDict[genreId],
            })
            .getMany();
        const targetCategoryIdList = categoryList.map(v => v.id);

        if (categoryList.length !== childCategoryDict[genreId].length) {
            console.error("[GENRE] 指定した childCategories に存在しないカテゴリが含まれています genre=" + genreId);
            console.error("[GENRE] 指定した childCategories=" + JSON.stringify(childCategoryDict[genreId]));
            console.error("[GENRE] 存在するカテゴリー category=" + JSON.stringify(targetCategoryIdList));
            return false;
        }

        for (const category of categoryList) {
            const query = manager
                .createQueryBuilder()
                .insert()
                .into(GenreCategory)
                .values({
                    genre: genre,
                    category: category,
                    deletedAt: null,
                })
                .orUpdate(
                    ["genreId", "categoryId", "deletedAt"],
                    ["genreId", "categoryId"]
                );
            await query.execute();

            console.log("[GENRE] 子カテゴリを追加しました genre=" + genreId + " category=" + category.id);
        }

        const deleteGenreCategoryList = await manager
            .createQueryBuilder(GenreCategory, "gc")
            .where("gc.genreId = :genreId and gc.categoryId not in (:targetCategoryIdList)")
            .setParameters({
                genreId: genre.id,
                targetCategoryIdList: targetCategoryIdList,
            })
            .getMany();
        if (deleteGenreCategoryList.length > 0) {
            const promiseList = [];
            for (const deleteGenreCategory of deleteGenreCategoryList) {
                promiseList.push(manager.softDelete(GenreCategory, deleteGenreCategory.id));
                console.warn("[GENRE] 子カテゴリを削除します genre=" + genreId + " category=" + deleteGenreCategory.id);
            }
            const results = await Promise.all(promiseList);
        }
    }

    console.log("[GENRE] <DONE> 子カテゴリ登録完了");

    return true;
}

const extractChildCategory = (genres: GenreTypeInJson[]) => {
    const childCategoryDict: {[key: string]: string[]} = {};

    for (const genre of genres) {
        const childCategoryIdList = [];
        for (const childCategory of genre.childCategories) {
            childCategoryIdList.push(
                getHash(childCategory.relativePathFromTop)
            );
        }
        childCategoryDict[getHash(genre.relativePathFromTop)] = childCategoryIdList;
    }

    return childCategoryDict;
}

export const importGenreCategoryInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const jsonedGenre = fs.readFileSync(genreFilePath);
    const genres: GenreTypeInJson[] = JSON.parse(jsonedGenre.toString("utf-8"));

    console.log("[GENRE] 小カテゴリを抽出します path=" + genreFilePath);
    const childCategoryDict = extractChildCategory(genres);
    for (const genreId of Object.keys(childCategoryDict)) {
        console.log("[GENRE] genre=" + genreId + " childCategories=" + JSON.stringify(childCategoryDict[genreId]));
    }

    const isSuccess = await upsertGenreCategory(manager, childCategoryDict);
    return isSuccess;
}
