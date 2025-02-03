// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import json5 from "json5";

import { appDataSource } from "../../data-source";
import { DBUtil } from "../../utils/db";

import { Skill } from "../../entity/skill";

// TODO: 外に出す
const skillFilePath = path.join(process.cwd(), "master_data", "skill", "skill_dat.json5");

type SkillType = {
    strId: string,
    displayName: string,
}

const extractSkills = (skillTree: {[key: string]: any}): SkillType[] => {
    const skillList: SkillType[] = [];

    for (const key of Object.keys(skillTree)) {
        const skill = skillTree[key];
        if (skill.basic_inf && skill.basic_inf.str_id && skill.basic_inf.dispname_jp) {
            skillList.push({
                strId: skill.basic_inf.str_id,
                displayName: skill.basic_inf.dispname_jp,
            });
        }
    }

    return skillList;
}

export const upsertSkill = async (manager: EntityManager, skillList: SkillType[] ) => {
    const promiseList = [];

    for (const skill of skillList) {
        const query = manager
            .createQueryBuilder()
            .insert()
            .into(Skill)
            .values({
                id: skill.strId,
                name: skill.displayName,
            })
            .orUpdate(
                ["name"],
                ["id"]
            );
        promiseList.push(query.execute());
    }

    return Promise.all(promiseList);
}

export const importSkillInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const json5edSkill = fs.readFileSync(skillFilePath);
    const skills = json5.parse(json5edSkill.toString("utf-8"));

    console.log("[SKILL] スキルを抽出します path=" + skillFilePath);
    const skillList: SkillType[] = extractSkills(skills);
    console.log("[SKILL] 抽出スキル skill=" + JSON.stringify(skillList));

    const results = await upsertSkill(manager, skillList);
    for (const result of results) {
        console.log("[SKILL] スキル " + result.generatedMaps[0].id + " を更新しました");
    }

    return true;
}
