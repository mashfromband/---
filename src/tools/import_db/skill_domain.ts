// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import json5 from "json5";

import { EntityManager, QueryRunner } from "typeorm";
import { appDataSource } from "../../data-source";
import { DBUtil } from "../../utils/db";
import { SkillDomain } from "../../entity/skill_domain";

// TODO: 外に出す
const skillDomainFilePath = path.join(process.cwd(), "master_data", "skill", "skill_domain_tree.json5");

const extractChildDomains = (skillDomainTree: {[key: string]: any}, skillDomainList: string[]) => {
    for (const key of Object.keys(skillDomainTree)) {
        skillDomainList.push(key);
        if ("childDomains" in skillDomainTree[key]) {
            extractChildDomains(skillDomainTree[key].childDomains, skillDomainList);
        }
    }
}

const insertSkillDomain = async (manager: EntityManager, skillDomainList: string[]) => {
    const allSkillDomainList = await manager
        .createQueryBuilder(SkillDomain, "sd")
        .orderBy("sd.id", "ASC")
        .getMany();

    const skillDomainName2Id: {[key: string]: string} = {};
    for (const skillDomain of allSkillDomainList) {
        skillDomainName2Id[skillDomain.name] = skillDomain.id;
    }

    const promiseList: Promise<SkillDomain>[] = [];
    for (const skillDomainName of skillDomainList) {
        if (skillDomainName in skillDomainName2Id) {
            continue;
        }
        else {
            const addSkillDomain = new SkillDomain(skillDomainName);
            promiseList.push(manager.save(addSkillDomain));
        }
    }

    if (promiseList.length === 0) {
        return [];
    }
    else {
        return Promise.all(promiseList);
    }
}

export const importSkillDomainInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const json5edSkillDomain = fs.readFileSync(skillDomainFilePath);
    const skillDomain = json5.parse(json5edSkillDomain.toString("utf-8"));

    const skillDomainList: string[] = [];

    console.log("[DOMAIN] ドメインを抽出します path=" + skillDomainFilePath);

    extractChildDomains(skillDomain, skillDomainList);

    console.log("[DOMAIN] 抽出ドメイン domain=" + JSON.stringify(skillDomainList));

    const insertSkillDomainList = await insertSkillDomain(manager, skillDomainList);
    if (insertSkillDomainList.length === 0) {
        console.log("[DOMAIN] 追加されるドメインはありません");
    }
    else {
        for (const insertSkillDomain of insertSkillDomainList) {
            console.log("[DOMAIN] ドメインが追加されました id=" + insertSkillDomain.id + " name=" + insertSkillDomain.name);
        }
    }

    return true;
}
