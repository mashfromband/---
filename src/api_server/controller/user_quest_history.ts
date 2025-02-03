// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";

import { User } from "../../entity/user";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { UserQuestHistory } from "../../entity/user_quest_history";


type GetUserQuestHistoryResponse =
    paths["/user/me/quest-history"]["get"]["responses"][200]["content"]["application/json"];
type OneUserQuestHistory =
    components["schemas"]["oneQuestHistory"];

export class UserQuestHistoryAPIController extends BaseAPIController {
    public async getList() {
        const isClearOnly = this.req.query.isClearOnly ? true : false;
        const [userQuestHistories, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserQuestHistory, "uqh")
                .leftJoinAndSelect("uqh.quest", "quest")
                .where("uqh.userId = :userId")
                .setParameters({
                    userId: this.userId,
                });
            if (isClearOnly) {
                query.andWhere("uqh.isClear = :isClear");
                query.setParameters({
                    isClear: true,
                });
            }
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt"], "id", "uqh",
            );
            return query.getManyAndCount();
        });

        const userQuestHistoryList: OneUserQuestHistory[] = [];
        for (const history of userQuestHistories as UserQuestHistory[]) {
            userQuestHistoryList.push({
                id: history.outgoingId,
                questId: history.quest!.id,
                questName: history.quest!.name,
                score: history.score,
                isClear: history.isClear,
                playYear: moment(history.createdAt).format("YYYY"),
                playMonth: moment(history.createdAt).format("MM"),
                playDay: moment(history.createdAt).format("DD"),
                playHour: moment(history.createdAt).format("HH"),
                playMinute: moment(history.createdAt).format("mm"),
            })
        }
        const response: GetUserQuestHistoryResponse = {
            questHistories: userQuestHistoryList,
            total: total,
        };
        this.responseJSON(response);
    }

    public async getOne() {
        const userQuestHistoryId = this.req.params.userQuestHistoryId as string;

        const userQuestHistory = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserQuestHistory, "uqh")
                .leftJoinAndSelect("uqh.quest", "quest")
                .where("uqh.outgoingId = :userQuestHistoryId and uqh.userId = :userId")
                .setParameters({
                    userQuestHistoryId: userQuestHistoryId,
                    userId: this.userId,
                });
            return query.getOne();
        });
        if (!userQuestHistory) {
            this.responseNoBody(404);
            return;
        }

        const response: OneUserQuestHistory = {
            id: userQuestHistory.outgoingId,
            questId: userQuestHistory.quest!.id,
            questName: userQuestHistory.quest!.name,
            score: userQuestHistory.score,
            isClear: userQuestHistory.isClear,
            playYear: moment(userQuestHistory.createdAt).format("YYYY"),
            playMonth: moment(userQuestHistory.createdAt).format("MM"),
            playDay: moment(userQuestHistory.createdAt).format("DD"),
            playHour: moment(userQuestHistory.createdAt).format("HH"),
            playMinute: moment(userQuestHistory.createdAt).format("mm"),
        };
        this.responseJSON(response);
    }
}
