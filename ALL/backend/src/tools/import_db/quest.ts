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

import {
    getAllTag,
    upsertTag,
} from "./tag";

import { Quest } from "../../entity/quest";
import { QuestTag } from "../../entity/quest_tag";
import { SkillDomain } from "../../entity/skill_domain";

// TODO: 外に出す
const questFilePath = path.join(process.cwd(), "master_data", "question", "quest.json");

type QuestTypeInJson = {
    id: string,
    name: string,
    detail: string,
    unique_key?: string,
    tags: string[],
    relativePathFromTop: string,
    domain: string,
    disableBackWrongAnswer?: boolean,
}

type QuestType = {
    id: string,
    name: string,
    detail: string,
    tags: string[],
    domain: string,
    disableBackWrongAnswer: boolean,
}

export const upsertQuest = async (manager: EntityManager, questList: QuestType[] ) => {
    const skillDomainMap = await getAllSkillDomains(manager);

    const promiseList = [];
    for (const quest of questList) {
        const skillDomain = skillDomainMap.get(quest.domain);
        const query = manager
            .createQueryBuilder()
            .insert()
            .into(Quest)
            .values({
                id: quest.id,
                name: quest.name,
                detail: quest.detail,
                skillDomain: skillDomain,
                disableBackWrongAnswer: quest.disableBackWrongAnswer,
            })
            .orUpdate(
                ["name", "detail", "skillDomainId", "disableBackWrongAnswer"],
                ["id"]
            );
        promiseList.push(query.execute());
    }

    return Promise.all(promiseList);
}

const getAllTags = (quests: QuestType[]) => {
    const tagSet = new Set<string>();
    for (const quest of quests) {
        for (const tag of quest.tags) {
            tagSet.add(tag);
        }
    }
    return Array.from(tagSet);
}

const getAllSkillDomains = async (manager: EntityManager) => {
    const skillDomains = await manager
        .createQueryBuilder(SkillDomain, "sd")
        .orderBy("sd.id", "ASC")
        .getMany();
    const skillDomainMap: Map<string, SkillDomain> = new Map();
    for (const skillDomain of skillDomains) {
        skillDomainMap.set(skillDomain.name, skillDomain);
    }
    return skillDomainMap;
}

const executeTag = async (manager: EntityManager, quests: QuestType[]) => {
    const tagList = getAllTags(quests);
    await upsertTag(manager, tagList);

    const allTagDict = await getAllTag(manager);

    const promiseList = [];
    for (const oneQuest of quests) {
        const quest = await manager
            .createQueryBuilder(Quest, "quest")
            .leftJoinAndSelect("quest.tags", "quest_tag")
            .leftJoinAndSelect("quest_tag.tag", "tag")
            .where("quest.id = :questId")
            .setParameters({
                questId: oneQuest.id,
            })
            .getOneOrFail();

        const currentTagList = [];
        if (quest.tags) {
            for (const questTag of quest.tags) {
                if (questTag.tag) {
                    currentTagList.push(questTag.tag);
                }
            }
        }
        if (oneQuest.tags.length !== currentTagList.length) {
            for (const currentTag of currentTagList) {
                if (!oneQuest.tags.includes(currentTag.name)) {
                    const deleteQuestTag = await manager
                        .createQueryBuilder(QuestTag, "qt")
                        .where("qt.questId = :questId and qt.tagId = :tagId")
                        .setParameters({
                            questId: quest.id,
                            tagId: currentTag.id,
                        })
                        .getOne();
                    if (deleteQuestTag) {
                        promiseList.push(
                            manager.softDelete(QuestTag, deleteQuestTag.id)
                        );
                    }
                }
            }
        }

        for (const tag of oneQuest.tags) {
            const query = manager
                .createQueryBuilder()
                .insert()
                .into(QuestTag)
                .values({
                    quest: quest,
                    tag: allTagDict[tag],
                    deletedAt: null,
                })
                .orUpdate(
                    ["questId", "tagId", "deletedAt"],
                    ["questId", "tagId"]
                );
            promiseList.push(query.execute());
        }
    }

    return Promise.all(promiseList);
}

const extractQuests = (quests: QuestTypeInJson[]) => {
    const questList: QuestType[] = [];

    for (const quest of quests) {
        questList.push({
            id: getHash(quest.relativePathFromTop),
            name: quest.name,
            detail: quest.detail,
            tags: quest.tags,
            domain: quest.domain,
            disableBackWrongAnswer: quest.disableBackWrongAnswer ? quest.disableBackWrongAnswer : false,
        });
    }

    return questList;
}

export const importQuestInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const jsonedQuest = fs.readFileSync(questFilePath);
    const quests: QuestTypeInJson[] = JSON.parse(jsonedQuest.toString("utf-8"));

    console.log("[QUEST] クエストを抽出します path=" + questFilePath);
    const questList: QuestType[] = extractQuests(quests);
    console.log("[QUEST] 抽出クエスト quest=" + JSON.stringify(questList));

    const results = await upsertQuest(manager, questList);
    for (let i = 0; i < results.length; i++) {
        console.log("[QUEST] クエスト " + questList[i].name + " を更新しました");
    }

    console.log("[QUEST] タグの処理を開始します");
    await executeTag(manager, questList);
    console.log("[QUEST] タグの処理が完了しました");

    return true;
}
