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

type GetListResponseType =
    paths["/user/me/skill"]["get"]["responses"][200]["content"]["application/json"];
type OneSkillType =
    components["schemas"]["oneSkill"];

export class UserSkillAPIController extends BaseAPIController {
    public async getList() {
        const [userSkills, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserSkill, "us")
                .leftJoinAndSelect("us.skill", "skill")
                .where("us.userId = :userId")
                .setParameters({
                    userId: this.userId,
                });
            this.setOrderByOffsetLimit(
                query, ["id", "createdAt", "updatedAt"], "id", "us",
            );

            return query.getManyAndCount();
        });

        const userSkillList: OneSkillType[] = [];
        for (const userSkill of userSkills as UserSkill[]) {
            userSkillList.push({
                id: userSkill.skill!.id,
                name: userSkill.skill!.name,
                level: userSkill.level,
                GottenAtYear: moment(userSkill.createdAt).format("YYYY"),
                GottenAtMonth: moment(userSkill.createdAt).format("MM"),
                GottenAtDay: moment(userSkill.createdAt).format("DD"),
            });
        }

        const response: GetListResponseType = {
            skills: userSkillList,
            total: total,
        };
        this.responseJSON(response);
    }
}
