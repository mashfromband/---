// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { getHash } from "./hash";

import {
    getAllTag,
    upsertTag,
} from "./tag";

import { Category } from "../../entity/category";
import { CategoryTag } from "../../entity/category_tag";

// TODO: 外に出す
const categoryFilePath = path.join(process.cwd(), "master_data", "question", "category.json");

export type CategoryTypeInJson = {
    id: string,
    name: string,
    detail: string,
    parentCategoryId?: string,
    rootCategoryId?: string,
    tags: string[],
    relativePathFromTop: string,
}

export type CategoryType = {
    id: string,
    originId: string,
    name: string,
    detail: string,
    parentCategoryId: string | null,
    rootCategoryId: string | null,
    tags: string[],
}

export const upsertCategory = async (manager: EntityManager, categoryList: CategoryType[] ) => {
    const promiseList = [];

    for (const category of categoryList) {
        const parentCategory = categoryList.find(v => v.originId === category.parentCategoryId);
        const rootCategory = categoryList.find(v => v.originId === category.rootCategoryId);

        const query = manager
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values({
                id: category.id,
                name: category.name,
                detail: category.detail,
                parentCategoryId: parentCategory ? parentCategory.id : null,
                rootCategoryId: rootCategory ? rootCategory.id : null,
            })
            .orUpdate(
                ["name", "detail", "parentCategoryId", "rootCategoryId"],
                ["id"]
            );
        promiseList.push(query.execute());
    }

    return Promise.all(promiseList);
}

const getAllTags = (categories: CategoryType[]) => {
    const tagSet = new Set<string>();
    for (const category of categories) {
        for (const tag of category.tags) {
            tagSet.add(tag);
        }
    }
    return Array.from(tagSet);
}

const executeTag = async (manager: EntityManager, categories: CategoryType[]) => {
    const tagList = getAllTags(categories);
    await upsertTag(manager, tagList);

    const allTagDict = await getAllTag(manager);

    const promiseList = [];
    for (const oneCategory of categories) {
        const category = await manager
            .createQueryBuilder(Category, "ct")
            .leftJoinAndSelect("ct.tags", "category_tag")
            .leftJoinAndSelect("category_tag.tag", "tag")
            .where("ct.id = :categoryId")
            .setParameters({
                categoryId: oneCategory.id,
            })
            .getOneOrFail();

        const currentTagList = [];
        if (category.tags) {
            for (const categoryTag of category.tags) {
                if (categoryTag.tag) {
                    currentTagList.push(categoryTag.tag);
                }
            }
        }
        if (oneCategory.tags.length !== currentTagList.length) {
            for (const currentTag of currentTagList) {
                if (!oneCategory.tags.includes(currentTag.name)) {
                    const deleteCategoryTag = await manager
                        .createQueryBuilder(CategoryTag, "ct")
                        .where("ct.categoryId = :categoryId and ct.tagId = :tagId")
                        .setParameters({
                            categoryId: category.id,
                            tagId: currentTag.id,
                        })
                        .getOne();
                    if (deleteCategoryTag) {
                        promiseList.push(
                            manager.softDelete(CategoryTag, deleteCategoryTag.id)
                        );
                    }
                }
            }
        }

        for (const tag of oneCategory.tags) {
            const query = manager
                .createQueryBuilder()
                .insert()
                .into(CategoryTag)
                .values({
                    category: category,
                    tag: allTagDict[tag],
                    deletedAt: null,
                })
                .orUpdate(
                    ["categoryId", "tagId", "deletedAt"],
                    ["categoryId", "tagId"]
                );
            promiseList.push(query.execute());
        }
    }

    return Promise.all(promiseList);
}

const extractCategories = (categories: CategoryTypeInJson[]) => {
    const categoryList: CategoryType[] = [];

    for (const category of categories) {
        categoryList.push({
            id: getHash(category.relativePathFromTop),
            originId: category.id,
            name: category.name,
            detail: category.detail,
            parentCategoryId: category.parentCategoryId ? category.parentCategoryId : null,
            rootCategoryId: category.rootCategoryId ? category.rootCategoryId : null,
            tags: category.tags,
        });
    }

    return categoryList;
}

export const importCategoryInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const jsonedCategory = fs.readFileSync(categoryFilePath);
    const categories: CategoryTypeInJson[] = JSON.parse(jsonedCategory.toString("utf-8"));

    console.log("[CATEGORY] カテゴリを抽出します path=" + categoryFilePath);
    const categoryList: CategoryType[] = extractCategories(categories);
    console.log("[CATEGORY] 抽出ジャンル category=" + JSON.stringify(categoryList));

    const results = await upsertCategory(manager, categoryList);
    for (let i = 0; i < results.length; i++) {
        console.log("[CATEGORY] カテゴリ " + categoryList[i].name + " を更新しました");
    }

    console.log("[CATEGORY] タグの処理を開始します");
    await executeTag(manager, categoryList);
    console.log("[CATEGORY] タグの処理が完了しました");

    return true;
}
