// -*- coding: utf-8 -*-

import fs from "fs";
import path from "path";

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { getHash } from "./hash";

import { Quest } from "../../entity/quest";
import {
    Mission,
    MissionAnswerType,
} from "../../entity/mission";

// TODO: 外に出す
const missionFilePath = path.join(process.cwd(), "master_data", "question", "mission_type.json");

type MissionTypeInJson = {
    id: string,
    questId: string,
    index: number,
    name: string,
    answerType: MissionAnswerType,
    correct: any,
    questionPath: string,
    optionPath: string,
    detailCorrectPath: string,
    detailWrongPath: string,
    relativePathFromTop: string,
    parentQuestRelativePathFromTop: string,
    allocScore: number,
}
type MissionType = MissionTypeInJson;

const questDict: {[id: string]: Quest} = {};
const getQuest = async (manager: EntityManager, parentQuestRelativePathFromTop: string) => {
    const questId = getHash(parentQuestRelativePathFromTop);

    if (questId in Object.keys(questDict)) {
        return questDict[questId];
    }

    const quest = await manager
        .createQueryBuilder(Quest, "q")
        .where("q.id = :questId")
        .setParameters({
            questId: questId,
        })
        .getOneOrFail();

    questDict[questId] = quest;
    return quest;
}

const upsertMission = async (manager: EntityManager, missionList: MissionType[]) => {
    const promiseList = [];

    for (const mission of missionList) {
        const quest = await getQuest(manager, mission.parentQuestRelativePathFromTop);
        const query = manager
            .createQueryBuilder()
            .insert()
            .into(Mission)
            .values({
                id: getHash(mission.relativePathFromTop),
                quest: quest,
                index: mission.index,
                answerType: mission.answerType,
                correct: mission.correct,
                questionPath: mission.questionPath.replace(/\\/g, "/"),
                optionPath: mission.optionPath.replace(/\\/g, "/"),
                correctCommentaryPath: mission.detailCorrectPath.replace(/\\/g, "/"),
                wrongCommentaryPath: mission.detailWrongPath.replace(/\\/g, "/"),
                score: mission.allocScore,
            })
            .orUpdate(
                [
                    "questId", "index",
                    "answerType", "correct",
                    "questionPath", "optionPath",
                    "correctCommentaryPath", "wrongCommentaryPath",
                    "score",
                ],
                ["id"]
            );
        promiseList.push(query.execute());
    }

    return Promise.all(promiseList);
}

export const importMissionInDB = async (queryRunner: QueryRunner, manager: EntityManager) => {
    const jsonedMission = fs.readFileSync(missionFilePath);
    const missionList: MissionType[] = JSON.parse(jsonedMission.toString("utf-8"));

    console.log("[MISSION] ミッションを抽出します path=" + missionFilePath);
    console.log("[MISSION] 抽出ミッション mission=" + JSON.stringify(missionList));

    const results = await upsertMission(manager, missionList);
    for (let i = 0; i < results.length; i++) {
        console.log("[MISSION] ミッション " + missionList[i].id + " を更新しました");
    }

    return true;
}
