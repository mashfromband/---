// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";
import moment from 'moment';

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";
import { SimpleResponseCache } from "../../common/cache/simple_response_cache";

import { UserSkill } from "../../entity/user_skill";

import type {
    paths,
    components,
} from "../../types/api/contents";
import { UserResults } from "../../entity/user_results";

type GetResultsResponseType =
    paths["/user/me/results"]["get"]["responses"][200]["content"]["application/json"];

 export class UserResultsAPIController extends BaseAPIController {
    public async getResults() {
        const userResults = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserResults, "ur")
                .leftJoinAndSelect("ur.user", "user")
                .where("ur.userId = :userId")
                .setParameters({
                    userId: this.userId,
                });
            return query.getOne();
        });

        if (!userResults) {
            this.responseJSON({
                level: 1,
                clearQuestCount: 0,
                totalScore: 0,
                point: 0,
                playQuestCount: 0,
                totalAnswerCount: 0,
                totalCorrectAnswerCount: 0,    
            });
            return;
        }
        else if (!userResults.user) {
            this.responseNoBody(404);
            return;
        }

        const response: GetResultsResponseType = {
            level: userResults.level,
            clearQuestCount: userResults.clearQuestCount,
            totalScore: userResults.totalScore,
            point: userResults.point,
            playQuestCount: userResults.playQuestCount,
            totalAnswerCount: userResults.totalAnswerCount,
            totalCorrectAnswerCount: userResults.totalCorrectAnswerCount,
        };
        this.responseJSON(response);
    }
}
