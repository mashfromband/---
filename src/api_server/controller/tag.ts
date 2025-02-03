// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { Tag } from "../../entity/tag";
import { Quest } from "../../entity/quest";
import { QuestTag } from "../../entity/quest_tag";

type ResponseGetTagList =
    paths["/tag"]["get"]["responses"][200]["content"]["application/json"];
type OneTag =
    components["schemas"]["oneTag"];

type ResponseGetQuestListByTag =
    paths["/tag/{tagId}/quest"]["get"]["responses"][200]["content"]["application/json"];
type oneQuestWithoutTags =
    components["schemas"]["oneQuestWithoutTags"];

export class TagAPIController extends BaseAPIController {
    public async getList() {
        const [tagList, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(Tag, "tag")
           this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "tag",
            );
            return query.getManyAndCount();
        });

        const responseTagList: OneTag[] = [];
        for (const tag of tagList as Tag[]) {
            responseTagList.push({
                id: tag.outgoingId,
                name: tag.name,
            });
        }

        const response: ResponseGetTagList = {
            tags: responseTagList,
            total: total,
        };
        this.responseJSON(response);
    }

    public async getQuestListByTag() {
        const tagId = this.req.params.tagId as string;
        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const tag = await manager
                .createQueryBuilder(Tag, "tag")
                .where("tag.outgoingId = :tagId")
                .setParameters({
                    tagId: tagId,
                })
                .getOne();
            if (!tag) {
                return {
                    error: {
                        status: 404,
                        reason: "存在しないタグです",
                    },
                };
            }

            const query = manager
                .createQueryBuilder(Quest, "quest")
                .leftJoinAndSelect(QuestTag, "qt")
                .where("qt.tagId = :tagId and quest.id = qt.questId")
                .setParameters({
                    tagId: tag.id,
                });
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "quest",
            );
            const [quests, total] = await query.getManyAndCount();

            return {
                quests: quests,
                total: total,
            }
        })
        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        const questList: oneQuestWithoutTags[] = [];
        for (const quest of result.quests as Quest[]) {
            questList.push({
                id: quest.id,
                name: quest.name,
                detail: quest.detail,
            });
        }

        this.responseJSON({
            quests: questList,
            total: result.total as number,
        });
    }
}
