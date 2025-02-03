// -*- coding: utf-8 -*-

import { EntityManager } from "typeorm";

import Config from "config";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";
import { SimpleResponseCache } from "../../common/cache/simple_response_cache";
import RedisConnection from "../../redis";

import type {
    paths,
    components,
} from "../../types/api/contents";

import { Quest } from "../../entity/quest";
import { QuestTag } from "../../entity/quest_tag";
import { UserQuestHistory } from "../../entity/user_quest_history";

type SuccessGetOneResponse =
    paths["/quest/{questId}"]["get"]["responses"][200]["content"]["application/json"];
type OneTagType = components["schemas"]["oneTag"];

type CachedResponseType = {
    id: string;
    name: string;
    detail: string;
    missionNum: number;
    tags: components["schemas"]["oneTag"][];
}

export class QuestAPIController extends BaseAPIController {
    public async getOne() {
        const questId = this.req.params.questId;

        const cacheResponseIns = new SimpleResponseCache("Quest", questId);
        const cachedQuest = await cacheResponseIns.load() as CachedResponseType | null;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            let quest: Quest | null = null;
            let questTags;

            if (!cachedQuest) {
                const query = manager
                    .createQueryBuilder(Quest, "quest")
                    .leftJoinAndSelect("quest.missions", "mission")
                    .where("quest.id = :questId")
                    .setParameters({
                        questId: questId,
                    });
                quest = await query.getOne();
                if (!quest || !quest.missions) {
                    return {
                        error: {
                            status: 404,
                            reason: "存在しないクエストです",
                        },
                    };
                }

                questTags = await QuestAPIController.getTagList(manager, quest.id);
            }

            const isClearQuest = await this.isClearQuest(manager, questId);

            return {
                quest: quest,
                tags: questTags,
                isClearQuest: isClearQuest,
            };
        });

        const quest = result.quest as Quest;
        const tags = result.tags as OneTagType[];
        const isClearQuest = result.isClearQuest as boolean;

        if (result.error) {
            this.responseNoBody(404);
            return;
        }

        let response: SuccessGetOneResponse;
        if (cachedQuest) {
            response = {
                id: cachedQuest.id,
                name: cachedQuest.name,
                detail: cachedQuest.detail,
                missionNum: cachedQuest.missionNum,
                tags: cachedQuest.tags,
                isClear: isClearQuest,
            };
        }
        else {
            response = {
                id: quest.id,
                name: quest.name,
                detail: quest.detail,
                missionNum: quest.missions ? quest.missions.length : 0,
                tags: tags,
                isClear: isClearQuest,
            }
            await cacheResponseIns.save(response);
        }
        this.responseJSON(response);
    }

    private async isClearQuest(manager: EntityManager, questId: string) {
        const ins = new UserClearQuestList(this.userId);
        return ins.isClearQuest(manager, questId);
    }

    public static async getTagList(manager: EntityManager, questId: string) {
        const questTags = await manager
            .createQueryBuilder(QuestTag, "qt")
            .leftJoinAndSelect("qt.tag", "tag")
            .where("qt.questId = :questId")
            .setParameters({
                questId: questId,
            })
            .getMany();

        const tagList: OneTagType[] = [];
        if (questTags.length > 0) {
            for (const questTag of questTags as QuestTag[]) {
                if (questTag.tag) {
                    tagList.push({
                        id: questTag.tag.outgoingId,
                        name: questTag.tag.name,
                    });
                }
            }
        }

        return tagList;
    }
}

export class UserClearQuestList {
    readonly userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    public async isClearQuest(manager: EntityManager, questId: string) {
        const redis = this.getRedis();
        const key = this.getRedisKey();
        const count = await redis.scard(key);
        if (count === 1) {
            return false;
        }
        else if (count > 1) {
            const isClear = await redis.sismember(key, questId);
            if (isClear === 1) {
                return true;
            }
            else {
                return false;
            }
        }

        const userClearQuestIdList = await this.getUserClearQuestListInDb(manager);
        await this.setUserClearQuestListInRedis(userClearQuestIdList);

        if (userClearQuestIdList.includes(questId)) {
            return true;
        }
        else {
            return false;
        }
    }

    public async getUserClearQuestList(manager: EntityManager) {
        const cachedUserClearQuestIdList = await this.getUserClearQuestListInRedis();
        if (cachedUserClearQuestIdList.length > 1) {
            return this.removeCacheMark(cachedUserClearQuestIdList);
        }
        else if (cachedUserClearQuestIdList.length === 1) {
            return [];
        }

        const userClearQuestIdList = await this.getUserClearQuestListInDb(manager);
        await this.setUserClearQuestListInRedis(userClearQuestIdList);
        return userClearQuestIdList;
    }

    private removeCacheMark(currentUserClearQuestIdList: string[]) {
        const userClearQuestIdList: string[] = [];
        for (const clearQuestId of currentUserClearQuestIdList) {
            if (clearQuestId !== "CACHED") {
                userClearQuestIdList.push(clearQuestId);
            }
        }
        return userClearQuestIdList;
    }

    private async getUserClearQuestListInDb(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserQuestHistory, "uqh")
            .leftJoinAndSelect("uqh.quest", "quest")
            .where("uqh.userId = :userId and uqh.isClear = :isClear and uqh.questId = quest.id")
            .setParameters({
                userId: this.userId,
                isClear: true,
            });
        const list = await query.getMany();
        if (list.length === 0) {
            return [];
        }

        const clearQuestIdList = list.map(v => v.quest!.id);
        return clearQuestIdList;
    }

    private async getUserClearQuestListInRedis() {
        const redis = this.getRedis();
        const key = this.getRedisKey();
        return redis.smembers(key);
    }

    private async setUserClearQuestListInRedis(userClearQuestIdList: string[]) {
        const expireSec = Config.get("simpleResponseCache.expireSec") as number;
        const redis = this.getRedis();
        const key = this.getRedisKey();
        const pipeline = redis.pipeline();
        pipeline.sadd(key, "CACHED");
        for (const userClearQuestId of userClearQuestIdList) {
            pipeline.sadd(key, userClearQuestId);
        }
        pipeline.expire(key, expireSec);
        await pipeline.exec();
    }

    public async clearUserClearQuestListInRedis() {
        const redis = this.getRedis();
        const key = this.getRedisKey();
        await redis.del(key);
    }

    private getRedis() {
        return RedisConnection.getConnection("dataCache");
    }

    private getRedisKey() {
        return "UserClearQuestList:" + this.userId;
    }
}
