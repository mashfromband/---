// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { appDataSource } from "../../data-source";
import { DBUtil } from "../../utils/db";
import { getHash } from "./hash";

import { getAllTag, upsertTag } from "./tag";

import { Genre } from "../../entity/genre";
import { GenreTag } from "../../entity/genre_tag";

// TODO: 外に出す
const genreFilePath = path.join(process.cwd(), "master_data", "question", "genre.json");

export type GenreChildCateriesType = {
    categoryId: string,
    relativePathFromTop: string,
}

export type GenreTypeInJson = {
    id: string,
    name: string,
    detail: string,
    tags: string[],
    childCategories: GenreChildCateriesType[],
    relativePathFromTop: string,
}

type GenreType = {
    id: string,
    name: string,
    detail: string,
    tags: string[],
    childCategories: GenreChildCateriesType[],
}

export const upsertGenre = async (manager: EntityManager, genreList: GenreType[]) => {
    const promiseList = [];

    for (const genre of genreList) {
        const query = manager
            .createQueryBuilder()
            .insert()
            .into(Genre)
            .values({
                id: genre.id,
                name: genre.name,
                detail: genre.detail,
            })
            .orUpdate(
                ["name", "detail"],
                ["id"]
            );
        promiseList.push(query.execute());
    }

    return Promise.all(promiseList);
}

const getAllTags = (genres: GenreType[]) => {
    const tagSet = new Set<string>();
    for (const genre of genres) {
        for (const tag of genre.tags) {
            tagSet.add(tag);
        }
    }
    return Array.from(tagSet);
}

const executeTag = async (manager: EntityManager, genres: GenreType[]) => {
    const tagList = getAllTags(genres);
    await upsertTag(manager, tagList);

    const allTagDict = await getAllTag(manager);

    const promiseList = [];
    for (const oneGenre of genres) {
        const genre = await manager
            .createQueryBuilder(Genre, "genre")
            .leftJoinAndSelect("genre.tags", "genre_tag")
            .leftJoinAndSelect("genre_tag.tag", "tag")
            .where("genre.id = :genreId")
            .setParameters({
                genreId: oneGenre.id,
            })
            .getOneOrFail();

        const currentTagList = [];
        if (genre.tags) {
            for (const genreTag of genre.tags) {
                if (genreTag.tag) {
                    currentTagList.push(genreTag.tag);
                }
            }
        }
        if (oneGenre.tags.length !== currentTagList.length) {
            for (const currentTag of currentTagList) {
                if (!oneGenre.tags.includes(currentTag.name)) {
                    const deleteGenreTag = await manager
                        .createQueryBuilder(GenreTag, "gt")
                        .where("gt.genreId = :genreId and gt.tagId = :tagId")
                        .setParameters({
                            genreId: genre.id,
                            tagId: currentTag.id,
                        })
                        .getOne();
                    if (deleteGenreTag) {
                        promiseList.push(
                            manager.softDelete(GenreTag, deleteGenreTag.id)
                        );
                    }
                }
            }
        }

        for (const tag of oneGenre.tags) {
            const query = manager
                .createQueryBuilder()
                .insert()
                .into(GenreTag)
                .values({
                    genre: genre,
                    tag: allTagDict[tag],
                    deletedAt: null,
                })
                .orUpdate(
                    ["genreId", "tagId", "deletedAt"],
                    ["genreId", "tagId"]
                );
            promiseList.push(query.execute());
        }
    }

    return Promise.all(promiseList);
}

const extractGenres = (genres: GenreTypeInJson[]) => {
    const genreList: GenreType[] = [];

    for (const genre of genres) {
        genreList.push({
            id: getHash(genre.relativePathFromTop),
            name: genre.name,
            detail: genre.detail,
            tags: genre.tags,
            childCategories: genre.childCategories,
        });
    }

    return genreList;
}

export const importGenreInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const jsonedGenre = fs.readFileSync(genreFilePath);
    const genres: GenreTypeInJson[] = JSON.parse(jsonedGenre.toString("utf-8"));

    console.log("[GENRE] ジャンルを抽出します path=" + genreFilePath);
    const genreList: GenreType[] = extractGenres(genres);
    console.log("[GENRE] 抽出ジャンル genre=" + JSON.stringify(genreList));

    const results = await upsertGenre(manager, genreList);
    for (let i = 0; i < results.length; i++) {
        console.log("[GENRE] ジャンル " + genreList[i].name + " を更新しました");
    }

    console.log("[GENRE] タグの処理を開始します");
    await executeTag(manager, genreList);
    console.log("[GENRE] タグの処理が完了しました");

    return true;
}
