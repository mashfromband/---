// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";
import { SimpleResponseCache } from "../../common/cache/simple_response_cache";

import { Genre } from "../../entity/genre";
import { GenreCategory } from "../../entity/genre_category";
import { GenreTag } from "../../entity/genre_tag";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { CategoryAPIController } from "./category";

type SuccessGetAllResponse =
    paths["/genre"]["get"]["responses"][200]["content"]["application/json"];
type OneGenreType = components["schemas"]["getAllGenreResponse"];
type OneTagType = components["schemas"]["oneTag"];

type SuccessGetOneResponse =
    paths["/genre/{genreId}"]["get"]["responses"][200]["content"]["application/json"];
type OneCategoryType = components["schemas"]["oneCategory"];

export class GenreAPIController extends BaseAPIController {
    public async getList() {
        const [genreList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(Genre, "genre");
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "genre",
            );
            const [genres, total] = await query.getManyAndCount();

            const genreList: OneGenreType[] = [];
            for (const genre of genres as Genre[]) {
                const tagList = await GenreAPIController.getTagList(manager, genre.id);
                const responseGenre: OneGenreType = {
                    id: genre.id,
                    name: genre.name,
                    detail: genre.detail,
                    tags: tagList,
                };
                genreList.push(responseGenre);
            }

            return [genreList, total];
        });

        const response: SuccessGetAllResponse = {
            genres: genreList as OneGenreType[],
            total: total as number,
        };
        this.responseJSON(response);
    }

    public async getOne() {
        const genreId = this.req.params.genreId;

        const cacheResponseIns = new SimpleResponseCache("Genre", genreId);
        const cachedResponse = await cacheResponseIns.load() as SuccessGetOneResponse | null;
        if (cachedResponse) {
            this.responseJSON(cachedResponse);
            return;
        }

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(Genre, "genre")
                .leftJoinAndSelect("genre.genreCategories", "genre_category")
                .leftJoinAndSelect("genre_category.category", "category")
                .where("genre.id = :genreId and category.parentCategoryId is null")
                .setParameters({
                    genreId: genreId,
                });
            const genre = await query.getOne();
            if (!genre) {
                return {
                    error: {
                        status: 404,
                        reason: "存在しないジャンルです",
                    },
                };
            }

            const tagList = await GenreAPIController.getTagList(manager, genre.id);

            const childCategoryList: OneCategoryType[] = [];
            if (genre.genreCategories) {
                for (const genreCategory of genre.genreCategories as GenreCategory[]) {
                    const category = genreCategory.category;
                    if (category) {
                        const tags = await CategoryAPIController.getTagList(manager, category.id);
                        childCategoryList.push({
                            id: category.id,
                            name: category.name,
                            detail: category.detail,
                            tags: tags,
                        });
                    }
                }
            }

            return {
                genre: genre,
                tags: tagList,
                childCategoryList: childCategoryList,
            }
        });

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        const genre = result.genre as Genre;
        const tags = result.tags as OneTagType[];
        const childCategoryList = result.childCategoryList as OneCategoryType[];

        const response: SuccessGetOneResponse = {
            id: genre.id,
            name: genre.name,
            detail: genre.detail,
            categories: childCategoryList,
            tags: tags,
        }
        this.responseJSON(response);

        await cacheResponseIns.save(response);
    }

    public static async getTagList(manager: EntityManager, genreId: string) {
        const genreTags = await manager
            .createQueryBuilder(GenreTag, "gt")
            .leftJoinAndSelect("gt.tag", "tag")
            .where("gt.genreId = :genreId")
            .setParameters({
                genreId: genreId,
            })
            .getMany();

        const tagList: OneTagType[] = [];
        if (genreTags.length > 0) {
            for (const genreTag of genreTags as GenreTag[]) {
                if (genreTag.tag) {
                    tagList.push({
                        id: genreTag.tag.outgoingId,
                        name: genreTag.tag.name,
                    });
                }
            }
        }

        return tagList;
    }
}
