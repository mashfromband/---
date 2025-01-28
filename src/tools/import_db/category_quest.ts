// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { getHash } from "./hash";

import { Category } from "../../entity/category";
import { Quest } from "../../entity/quest";
import { CategoryQuest } from "../../entity/category_quest";

// TODO: 外に出す
const categoryQuestFilePath = path.join(process.cwd(), "master_data", "question", "category_quest.json");

type CategoryQuestTypeInJson = {
    id: string,
    categoryId: string,
    questId: string,
    quest_unique_key?: string,
    linked_quest_unique_key?: string,
    questRelativePathFromTop: string,
    categoryRelativePathFromTop: string,
    linkQuestRelativePathFromTop?: string,
}

const upsertCategoryQuest = async (manager: EntityManager, categoryQuestList: CategoryQuestTypeInJson[]) => {
    console.log("[CATEGORY-QUEST] <BEGIN> カテゴリ〜クエスト登録開始");

    const doneCategoryQuestIdList = [];

    for (const categoryQuest of categoryQuestList) {
        const category = await manager
            .createQueryBuilder(Category, "ct")
            .where("ct.id = :categoryId")
            .setParameters({
                categoryId: getHash(categoryQuest.categoryRelativePathFromTop),
            })
            .getOneOrFail();

        const quest = await manager
            .createQueryBuilder(Quest, "quest")
            .where("quest.id = :questId")
            .setParameters({
                questId: getHash(categoryQuest.questRelativePathFromTop),
            })
            .getOneOrFail();

        console.log("[CATEGORY-QUEST] カテゴリ〜クエストを登録開始します category=" + categoryQuest.categoryId + " quest=" + categoryQuest.questId);
        const query = manager
            .createQueryBuilder()
            .insert()
            .into(CategoryQuest)
            .values({
                category: category,
                quest: quest,
                deletedAt: null,
            })
            .orUpdate(
                ["categoryId", "questId", "deletedAt"],
                ["categoryId", "questId"]
            );
        const result = await query.execute();

        const doneCategoryQuest = await manager
            .createQueryBuilder(CategoryQuest, "cq")
            .where("cq.categoryId = :categoryId and cq.questId = :questId")
            .setParameters({
                categoryId: category.id,
                questId: quest.id,
            })
            .getOneOrFail();
        doneCategoryQuestIdList.push(doneCategoryQuest.id);
        console.log("[CATEGORY-QUEST] カテゴリ〜クエストを登録完了します category=" + categoryQuest.categoryId + " quest=" + categoryQuest.questId + " categoryQuest" + doneCategoryQuest.id);
    }

    const deleteCategoryQuestList = await manager
        .createQueryBuilder(CategoryQuest, "cq")
        .leftJoinAndSelect("cq.category", "category")
        .leftJoinAndSelect("cq.quest", "quest")
        .where("cq.id not in (:categoryQuestIdList)")
        .setParameters({
            categoryQuestIdList: doneCategoryQuestIdList,
        })
        .getMany();
    if (deleteCategoryQuestList.length > 0) {
        for (const deleteCategoryQuest of deleteCategoryQuestList) {
            console.log("[CATEGORY-QUEST] 不要なカテゴリ〜クエストを削除しました category=" + deleteCategoryQuest.category!.id + " quest=" + deleteCategoryQuest.quest!.id + " categoryQuest=" + deleteCategoryQuest.id);
            await manager.softDelete(CategoryQuest, deleteCategoryQuest.id);
        }
    }

    console.log("[CATEGORY-QUEST] <DONE> カテゴリ〜クエスト登録完了");

    return true;
}

export const importCategoryQuestInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const jsonedCategoryQuest = fs.readFileSync(categoryQuestFilePath);
    const categoryQuests: CategoryQuestTypeInJson[] = JSON.parse(jsonedCategoryQuest.toString("utf-8"));

    console.log("[CATEGORY-QUEST] クエスト〜カテゴリの関係を抽出します path=" + categoryQuestFilePath);
    const isSuccess = await upsertCategoryQuest(manager, categoryQuests);
    return isSuccess;
}
