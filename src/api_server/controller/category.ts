// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";
import {
    QuestAPIController,
    UserClearQuestList,
} from "./quest";

import { Category } from "../../entity/category";
import { Genre } from "../../entity/genre";
import { Quest } from "../../entity/quest";
import { CategoryQuest } from "../../entity/category_quest";
import { CategoryTag } from "../../entity/category_tag";

import type {
    paths,
    components,
} from "../../types/api/contents";

type SuccessGetOneResponse =
    paths["/category/{categoryId}"]["get"]["responses"][200]["content"]["application/json"];
type OneCategoryType = components["schemas"]["oneCategory"];
type OneQuestType = components["schemas"]["oneQuest"];
type OneTagType = components["schemas"]["oneTag"];

export class CategoryAPIController extends BaseAPIController {
    private async getOneCategory(manager: EntityManager, categoryId: string) {
        const query = manager
            .createQueryBuilder(Category, "ct")
            .leftJoinAndSelect("ct.genreCategories", "genre_category")
            .leftJoinAndSelect("genre_category.genre", "genre")
            .where("ct.id = :categoryId")
            .setParameters({
                categoryId: categoryId,
            });
        const category = await query.getOne();
        if (!category) {
            return {
                category: category,
                tags: [],
            }
        }

        const tags = await CategoryAPIController.getTagList(manager, category.id);

        return {
            category: category,
            tags: tags,
        };
    }

    private async getUserClearQuestList(manager: EntityManager) {
        const ins = new UserClearQuestList(this.userId);
        return ins.getUserClearQuestList(manager);
    }

    private async getChildQuest(manager: EntityManager, category: Category) {
        const query = manager
            .createQueryBuilder(Quest, "quest")
            .leftJoinAndSelect(CategoryQuest, "cq")
            .where("cq.categoryId = :categoryId and quest.id = cq.questId")
            .setParameters({
                categoryId: category.id,
            })
            .orderBy("quest.createdAt", "ASC");
        const childQuests = await query.getMany();
        if (childQuests.length === 0) {
            return [];
        }

        const clearUserQuestList = await this.getUserClearQuestList(manager);
        const clearUserQuestSet = new Set(clearUserQuestList);

        const childQuestList: OneQuestType[] = [];
        for (const quest of childQuests) {
            const questTags = await QuestAPIController.getTagList(manager, quest.id);
            childQuestList.push({
                id: quest.id,
                name: quest.name,
                detail: quest.detail,
                tags: questTags,
                isClear: clearUserQuestSet.has(quest.id),
            });
        }

        return childQuestList;
    }

    private async getChildCategory(manager: EntityManager, category: Category) {
        const query = manager
            .createQueryBuilder(Category, "ct")
            .where("ct.parentCategoryId = :categoryId")
            .setParameters({
                categoryId: category.id,
            });
        const childCategories = await query.getMany();
        if (childCategories.length === 0) {
            return [];
        }

        const childCategoryList: OneCategoryType[] = [];
        for (const category of childCategories) {
            const tags = await CategoryAPIController.getTagList(manager, category.id);
            childCategoryList.push({
                id: category.id,
                name: category.name,
                detail: category.detail,
                tags: tags,
            });
        }

        return childCategoryList;
    }

    public async getOne() {
        const categoryId = this.req.params.categoryId;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const result = await this.getOneCategory(manager, categoryId);
            if (!result.category) {
                return {
                    error: {
                        status: 404,
                        reason: "カテゴリーが存在しません",
                    },
                };
            }

            const category = result.category as Category;
            const tags = result.tags as OneTagType[];

            let genre: Genre;
            if (category.rootCategoryId) {
                const rootCategoryResult = await this.getOneCategory(manager, category.rootCategoryId);
                const rootCategory = rootCategoryResult.category;
                const rootCategoryTags = rootCategoryResult.tags;
                if (!rootCategory || !rootCategory.genreCategories || rootCategory.genreCategories.length === 0 || !rootCategory.genreCategories[0].genre) {
                    return {
                        error: {
                            status: 404,
                            reason: "カテゴリーが存在しません",
                        },
                    };
                }
                genre = rootCategory.genreCategories[0].genre;
            }
            else {
                genre = category.genreCategories![0].genre!;
            }

            const childCategoryList = await this.getChildCategory(manager, category);
            const questList = await this.getChildQuest(manager, category);

            const getParentCategory = async (): Promise<OneCategoryType | undefined> => {
                if (category.parentCategoryId) {
                    const result = await this.getOneCategory(manager, category.parentCategoryId);
                    if (result.category) {
                        return {
                            id: result.category.id,
                            name: result.category.name,
                            detail: result.category.detail,
                            tags: result.tags,
                        };
                    }
                }
                return undefined;
            }
            const parentCategory = await getParentCategory();

            return {
                category: category,
                genre: genre,
                quests: questList,
                childCategories: childCategoryList,
                parentCategory: parentCategory,
                tags: tags,
            }
        });
        if (result.error) {
            this.responseJSON(result.error, result.error.startsWith);
            return;
        }

        const category: Category = result.category;
        const genre: Genre = result.genre;
        const childQuestList: OneQuestType[] = result.quests;
        const childCategories: OneCategoryType[] = result.childCategories;
        const parentCategory: OneCategoryType | undefined = result.parentCategory;
        const tags: OneTagType[] = result.tags;

        const response: SuccessGetOneResponse = {
            id: category.id,
            name: category.name,
            detail: category.detail,
            quests: childQuestList,
            genreId: genre.id,
            genreName: genre.name,
            tags: tags,
        }
        if (parentCategory) {
            response.parentCategory = parentCategory;
        }
        if (childCategories) {
            response.childCategories = childCategories;
        }

        this.responseJSON(response);
    }

    public static async getTagList(manager: EntityManager, categoryId: string) {
        const categoryTags = await manager
            .createQueryBuilder(CategoryTag, "ct")
            .leftJoinAndSelect("ct.tag", "tag")
            .where("ct.categoryId = :categoryId")
            .setParameters({
                categoryId: categoryId,
            })
            .getMany();

        const tagList: OneTagType[] = [];
        if (categoryTags.length > 0) {
            for (const categoryTag of categoryTags as CategoryTag[]) {
                if (categoryTag.tag) {
                    tagList.push({
                        id: categoryTag.tag.outgoingId,
                        name: categoryTag.tag.name,
                    });
                }
            }
        }

        return tagList;
    }
}
