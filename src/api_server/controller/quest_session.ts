// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../utils/db";
import RedisConnection from "../../redis";
import { Secrets } from "../../utils/secrets";
import { BaseAPIController } from "./base";
import { CommonSkillHandler } from "../../common/skill";
import { UserClearQuestList } from "./quest";
import { CommonAddUserHaveEfoHandler } from "../../common/efo/add";
import { CommonGetUserHaveEfoHandler } from "../../common/efo/get_user_have";

import { Quest } from "../../entity/quest";
import { Mission } from "../../entity/mission";
import { User } from "../../entity/user";
import { UserQuestHistory } from "../../entity/user_quest_history";
import { UserResults } from "../../entity/user_results";
import { UserSkill } from "../../entity/user_skill";
import { Skill } from "../../entity/skill";
import { UserSkillDomain } from "../../entity/user_skill_domain";
import { SkillDomain } from "../../entity/skill_domain";

import type {
    TypeUser,
    TypeUserDatSkill,
} from "../../external/skill/skill_manager";

import type {
    paths,
    components,
} from "../../types/api/contents";

type SuccessCreateSessioneResponse =
    paths["/quest/{questId}/session"]["post"]["responses"][200]["content"]["application/json"];
type SuccessGetSessionResponse =
    paths["/quest/{questId}/session/{sessionToken}"]["get"]["responses"][200]["content"]["application/json"];
type SuccessAnswerSessionResponse =
    paths["/quest/{questId}/session/{sessionToken}"]["post"]["responses"][200]["content"]["application/json"];
type SuccessResultSessionResponse =
    paths["/quest/{questId}/session/{sessionToken}/result"]["get"]["responses"][200]["content"]["application/json"];

export class QuestSessionAPIController extends BaseAPIController {
    public async createSession() {
        const questId = this.req.params.questId;

        const quest = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            return this.getQuest(manager, questId);
        })
        if (!quest) {
            this.responseNoBody(404);
            return;
        }

        const questSession = await QuestSessionStore.create(this.userId, questId);
        await questSession.save(this.accessDate);

        const response: SuccessCreateSessioneResponse = {
            id: questSession.token,
            questId: questId,
            questName: quest.name,
            expireAt: questSession.expireAt,
        }
        this.responseJSON(response);
    }

    private async getQuest(manager: EntityManager, questId: string) {
        const query = manager
            .createQueryBuilder(Quest, "quest")
            .leftJoinAndSelect("quest.skillDomain", "skill_domain")
            .where("quest.id = :questId")
            .setParameters({
                questId: questId,
            });
        return query.getOne();
    }

    private getRetryMission(quest: Quest) {
        if (quest.disableBackWrongAnswer) {
            return false;
        }
        else if (this.req.query.isRetryMission === undefined) {
            return false;
        }
        else if (this.req.query.isRetryMission === "true") {
            return true;
        }
        return false;
    }

    public async getSession() {
        const questId = this.req.params.questId;
        const sessionToken = this.req.params.sessionToken;

        const [quest, missionList] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const quest = await this.getQuest(manager, questId);
            const missionList = await this.getMissionList(manager, questId);
            return [quest, missionList];
        })
        if (!quest) {
            this.responseNoBody(404);
            return;
        }

        const questSession = await this.getQuestSession(sessionToken);
        if (!questSession) {
            this.responseNoBody(404);
            return;
        }

        const isRetryMission = this.getRetryMission(quest);
        const totalMissions = missionList.length;

        if (isRetryMission) {
            const recvCurrentMissionIndex = parseInt(this.req.query.currentMissionIndex as string, 10);
            questSession.currentMissionIndex = recvCurrentMissionIndex;
            const delta = questSession.answer.length - recvCurrentMissionIndex;
            for (let i = 0; i < delta; i++) {
                questSession.answer.pop();
                questSession.correctResultList.pop();
            }
            await questSession.save(this.accessDate);
        }

        const currentMissionIndex = questSession.currentMissionIndex;

        const response: SuccessGetSessionResponse = {
            id: questSession.token,
            questId: questSession.questId,
            questName: quest.name,
            expireAt: questSession.expireAt,
            questionPath: missionList[currentMissionIndex].questionPath,
            answerType: missionList[currentMissionIndex].answerType,
            optionPath: missionList[currentMissionIndex].optionPath,
            totalMissions: totalMissions,
            currentMissionIndex: currentMissionIndex,
        };
        this.responseJSON(response);
    }

    private async getMissionList(manager: EntityManager, questId: string) {
        const query = manager
            .createQueryBuilder(Mission, "mission")
            .where("mission.questId = :questId")
            .setParameters({
                questId: questId,
            })
            .orderBy("mission.index", "ASC");
        return query.getMany();
    }

    private async getQuestSession(sessionToken: string) {
        const questSession = new QuestSessionStore(sessionToken, this.userId);
        const isExist = await questSession.load();
        if (!isExist) {
            return null;
        }
        return questSession;
    }

    public async getAnswer() {
        const questId = this.req.params.questId;
        const sessionToken = this.req.params.sessionToken;

        const [quest, missionList] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const quest = await this.getQuest(manager, questId);
            const missionList = await this.getMissionList(manager, questId);
            return [quest, missionList];
        })
        if (!quest) {
            this.responseNoBody(404);
            return;
        }

        const questSession = await this.getQuestSession(sessionToken);
        if (!questSession) {
            this.responseNoBody(404);
            return;
        }

        const totalMissions = missionList.length;
        const currentMissionIndex = questSession.currentMissionIndex;

        const answer = this.req.body.answer as string;
        const isCorrect = this.isCorrect(answer, missionList[currentMissionIndex]);

        questSession.answer.push(answer);
        questSession.correctResultList.push(isCorrect);
        questSession.currentMissionIndex++;
        await questSession.save(this.accessDate);

        const commentaryPath = isCorrect ? missionList[currentMissionIndex].correctCommentaryPath : missionList[currentMissionIndex].wrongCommentaryPath;

        const response: SuccessAnswerSessionResponse = {
            id: questSession.token,
            expireAt: questSession.expireAt,
            answerType: missionList[currentMissionIndex].answerType,
            isCorrect: isCorrect,
            correctAnswer: missionList[currentMissionIndex].correct.toString(),
            commentaryPath: commentaryPath,
            totalMissions: totalMissions,
            currentMissionIndex: currentMissionIndex,
            isFinished: this.isFinished(totalMissions, questSession),
            disableBackWrongAnswer: quest.disableBackWrongAnswer,
        }
        this.responseJSON(response);
    }

    private isFinished(totalMissions: number, questSession: QuestSessionStore) {
        if (totalMissions <= questSession.currentMissionIndex) {
            return true;
        }
        return false;
    }

    private isCorrect(answer: string, mission: Mission) {
        const answerType = mission.answerType;

        switch (answerType) {
            case "one_choice": {
                if (answer == mission.correct) {
                    return true;
                }
                else {
                    return false;
                }
            }

            default:
                return false;
        }
    }

    private async isClearedQuest(manager: EntityManager, userId: string, questId: string) {
        const query = manager
            .createQueryBuilder(UserQuestHistory, "uqh")
            .where("uqh.userId = :userId and uqh.questId = :questId and uqh.isClear = :isClear")
            .setParameters({
                userId: userId,
                questId: questId,
                isClear: true,
            });
        const count = await query.getCount();
        if (count > 0) {
            return true;
        }
        return false;
    }

    public async getQuestResult() {
        const questId = this.req.params.questId;
        const sessionToken = this.req.params.sessionToken;

        const questSession = await this.getQuestSession(sessionToken);
        if (!questSession) {
            this.responseNoBody(404);
            return;
        }

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner ,manager: EntityManager) => {
            const user = await manager
                .createQueryBuilder(User, "user")
                .leftJoinAndSelect("user.profile", "user_profile")
                .leftJoinAndSelect("user.results", "user_results")
                .where("user.id = :userId and user.isValid = :isValid")
                .setParameters({
                    userId: this.userId,
                    isValid: true,
                })
                .getOne();
            if (!user || !user.profile) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "存在しないユーザーです",
                    },
                };
            }

            const userResults = user.results ? user.results : new UserResults(user);

            const quest = await this.getQuest(manager, questId);
            if (!quest) {
                await queryRunner.rollbackTransaction();
                return {
                    error: {
                        status: 404,
                        reason: "存在しないクエストです",
                    },
                };
            }

            const missionList = await this.getMissionList(manager, questId);
            const isFinished = this.isFinished(missionList.length, questSession);
            if (!isFinished) {
                await queryRunner.rollbackTransaction();
                // TODO: ちゃんとする
                return {
                    error: {
                        status: 404,
                    },
                };
            }

            const aggregation = this.getAggregation(questSession, missionList);

            const isClearedQuest = await this.isClearedQuest(manager, user.id, quest.id);
            if (isClearedQuest) {
                await this.addUserQuestHistory(manager, user, quest, aggregation.user, aggregation.isPerfect);
                await queryRunner.commitTransaction();
                return {
                    isClearedQuest: true,
                    aggregation: aggregation,
                    userResults: userResults,
                };
            }

            const scaleForExp = 1.0; // TODO: ちゃんとする
            const userAddExp = aggregation.isPerfect ? aggregation.total : 0;

            userResults.playQuestCount++;
            userResults.totalAnswerCount += aggregation.totalMissoinNum;
            userResults.totalCorrectAnswerCount += aggregation.userCorrectNum;

            if (!aggregation.isPerfect) {
                const userQuestHistory = new UserQuestHistory(user, quest, aggregation.user, aggregation.isPerfect);
                await manager.save(userQuestHistory);
                await manager.save(userResults);
                await queryRunner.commitTransaction();

                return {
                    isClearedQuest: false,
                    aggregation: aggregation,
                    userResults: userResults,
                };
            }

            const haveUserSkillInfo = await this.getHaveUserSkill(manager, user);
            const haveUserSkillDomainInfo = await this.getHaveUserSkillDomain(manager, user);

            const userInfo: TypeUser = {
                id: user.id,
                name: user.profile.nickname,
                level_num: userResults.level,
                exp: userResults.exp,
                quest_clear_count: userResults.clearQuestCount,
                quest_clear_dom_num: haveUserSkillDomainInfo.userSkillDomainDict,
                total_score: userResults.totalScore,
                point: userResults.point,
                skills: haveUserSkillInfo.userSkillList,
                honors: [],
            };
            const addInfo = {
                "quest_clear_count": aggregation.isPerfect ? 1 : 0,
                "score": aggregation.user,
                "domain": quest.skillDomain ? quest.skillDomain.name: "USER",
            };

            this.loggingInfo("skillManager request", {
                userInfo: userInfo,
                addInfo: addInfo,
            });
            const skillManager = CommonSkillHandler.get();

            const skillCheckResult = await skillManager.skillCheck(
                ["on_quest_clear", "on_skill_exp_added"],
                userInfo,
                addInfo,
            );
            this.loggingInfo("skillManager response", {
                skillCheckResult: skillCheckResult,
                userSkills: skillCheckResult.user.skills,
            });

            const addPoint = skillCheckResult.user.point - userResults.point;

            userResults.point = skillCheckResult.user.point;
            userResults.clearQuestCount = skillCheckResult.user.quest_clear_count;
            userResults.exp = skillCheckResult.user.exp;
            userResults.totalScore = skillCheckResult.user.total_score;
            userResults.level = skillCheckResult.user.level_num;

            const upsertUserSkill = async (skill: TypeUserDatSkill) => {
                const targetUserSkill = haveUserSkillInfo.userSkillMap.get(skill.str_id);
                if (targetUserSkill) {
                    targetUserSkill.level = skill.level_num;
                    targetUserSkill.exp = skill.exp;
                    await manager.save(targetUserSkill);
                }
                else {
                    const targetSkill = await manager
                        .createQueryBuilder(Skill, "skill")
                        .where("skill.id = :skillId")
                        .setParameters({
                            skillId: skill.str_id,
                        })
                        .getOneOrFail();
                    const newUserSkill = new UserSkill(user, targetSkill);
                    newUserSkill.exp = skill.exp;
                    newUserSkill.level = skill.level_num;
                    await manager.save(newUserSkill);
                }
            }

            const skills = skillCheckResult.user.skills;
            for (const skill of skills) {
                await upsertUserSkill(skill);
            }

            const upsertUserSkillDomain = async (skillDomainName: string, clearCount: number) => {
                const targetUserSkillDomain = haveUserSkillDomainInfo.userSkillDomainMap.get(skillDomainName);
                if (targetUserSkillDomain) {
                    targetUserSkillDomain.clearCount = clearCount;
                    await manager.save(targetUserSkillDomain);
                }
                else {
                    const skillDomain = await manager
                        .createQueryBuilder(SkillDomain, "sd")
                        .where("sd.name = :skillDomainName")
                        .setParameters({
                            skillDomainName: skillDomainName,
                        })
                        .getOneOrFail();
                    const newUserSkillDomain = new UserSkillDomain(user, skillDomain);
                    newUserSkillDomain.clearCount = clearCount;
                    await manager.save(newUserSkillDomain);
                }
            }

            const changeUserSkillDomainParams = skillCheckResult.user.quest_clear_dom_num;
            if (changeUserSkillDomainParams) {
                for (const skillDomainName of Object.keys(changeUserSkillDomainParams)) {
                    await upsertUserSkillDomain(
                        skillDomainName, changeUserSkillDomainParams[skillDomainName]
                    );
                }
            }

            const userEfoHistory = await CommonAddUserHaveEfoHandler.addByQuestClear(
                this.logger, manager, user, addPoint,
            );

            // const userQuestHistory = new UserQuestHistory(user, quest, aggregation.user, aggregation.isPerfect);
            // await manager.save(userQuestHistory);
            await this.addUserQuestHistory(manager, user, quest, aggregation.user, aggregation.isPerfect);

            await manager.save(userResults);
            await queryRunner.commitTransaction();

            return {
                quest: quest,
                missionList: missionList,
                aggregation: aggregation,
                scaleForExp: scaleForExp,
                userAddExp: userAddExp,
                skillCheckResult: skillCheckResult,
                userResults: userResults,
                addPoint: addPoint,
                userEfoHistory: userEfoHistory,
            };
        });

        await questSession.delete();
        await this.clearUserQuestClearCache();
        await CommonGetUserHaveEfoHandler.clearCache(this.userId);

        if (result.error) {
            this.responseJSON(result.error, result.error.status);
            return;
        }

        if (result.isClearedQuest || !result.aggregation.isPerfect) {
            const response: SuccessResultSessionResponse = {
                id: sessionToken,
                isPerfect: result.aggregation.isPerfect,
                totalMissionNum: result.aggregation.totalMissoinNum,
                userCorrectNum: result.aggregation.userCorrectNum,
                totalScore: result.aggregation.total,
                userScore: result.aggregation.user,
                scaleForExp: 1, // TODO: 廃止予定
                userAddExp: 0, // TODO: 廃止予定
                addPoint: 0,
                totalPoint: 0,
                pointBounsPer: 0,
                userLevel: result.userResults.level,
                messages: [],
            }
            this.responseJSON(response);
            return;
        }

        const skillCheckMessages = result.skillCheckResult.result as any[];
        const skillCheckMessageList = skillCheckMessages.map(v => v.msg);
        const userResults = result.userResults as UserResults;
        const pointBounsPer = result.skillCheckResult.effectedAdd.point_bonus_per ? result.skillCheckResult.effectedAdd.point_bonus_per : 1;

        const response: SuccessResultSessionResponse = {
            id: sessionToken,
            isPerfect: result.aggregation.isPerfect,
            totalMissionNum: result.aggregation.totalMissoinNum,
            userCorrectNum: result.aggregation.userCorrectNum,
            totalScore: result.aggregation.total,
            userScore: result.aggregation.user,
            scaleForExp: result.scaleForExp, // TODO: 廃止予定
            userAddExp: result.userAddExp, // TODO: 廃止予定
            addPoint: result.addPoint,
            totalPoint: userResults.point,
            pointBounsPer: pointBounsPer,
            userLevel: result.userResults.level,
            messages: skillCheckMessageList,
        }
        this.responseJSON(response);
    }

    private async addUserQuestHistory(
        manager: EntityManager, user: User, quest: Quest, score: number, isClear: boolean,
    ) {
        const userQuestHistory = new UserQuestHistory(user, quest, score, isClear);
        await manager.save(userQuestHistory);
    }

    private async clearUserQuestClearCache() {
        const ins = new UserClearQuestList(this.userId);
        return ins.clearUserClearQuestListInRedis();
    }

    private async getHaveUserSkill(manager: EntityManager, user: User) {
        const haveUserSkills: UserSkill[] = await manager
            .createQueryBuilder(UserSkill, "us")
            .leftJoinAndSelect("us.skill", "skill")
            .where("us.userId = :userId and us.skillId = skill.id")
            .setParameters({
                userId: user.id,
            })
            .setLock("pessimistic_write")
            .getMany();

        const userSkillList: TypeUserDatSkill[] = haveUserSkills.map((v) => {
            return {
                str_id: v.skill!.id,
                exp: v.exp,
                level_num: v.level,
            }
        });

        const userSkillMap: Map<string, UserSkill> = new Map();
        for (const userSkill of haveUserSkills) {
            userSkillMap.set(userSkill.skill!.id, userSkill);
        }

        return {
            haveUserSkills: haveUserSkills,
            userSkillList: userSkillList,
            userSkillMap: userSkillMap,
        }
    }

    private async getHaveUserSkillDomain(manager: EntityManager, user: User) {
        const haveUserSkillDomains: UserSkillDomain[] = await manager
            .createQueryBuilder(UserSkillDomain, "usd")
            .leftJoinAndSelect("usd.skillDomain", "skill_domain")
            .where("usd.userId = :userId and usd.skillDomainId = skill_domain.id")
            .setParameters({
                userId: user.id,
            })
            .setLock("pessimistic_write")
            .getMany();

        const userSkillDomainDict: Record<string, number> = {};
        const userSkillDomainMap: Map<string, UserSkillDomain> = new Map();
        for (const userSkillDomain of haveUserSkillDomains) {
            userSkillDomainDict[userSkillDomain.skillDomain!.name] = userSkillDomain.clearCount;
            userSkillDomainMap.set(userSkillDomain.skillDomain!.name, userSkillDomain);
        }

        return {
            haveUserSkillDomains: haveUserSkillDomains,
            userSkillDomainDict: userSkillDomainDict,
            userSkillDomainMap: userSkillDomainMap,
        }
    }

    private getAggregation(questSession: QuestSessionStore, missionList: Mission[]) {
        let userScore = 0;
        let totalScore = 0;
        let userCorrectNum = 0;
        const totalMissionNum = missionList.length;
        for (let i = 0; i < questSession.correctResultList.length; i++) {
            const score = missionList[i].score;
            totalScore += score;
            if (questSession.correctResultList[i]) {
                userScore += score;
                userCorrectNum++;
            }
        }
        return {
            total: totalScore,
            user: userScore,
            isPerfect: totalMissionNum === userCorrectNum,
            totalMissoinNum: totalMissionNum,
            userCorrectNum: userCorrectNum,
        }
    }

    public async cancelQuest() {
        const questId = this.req.params.questId;
        const sessionToken = this.req.params.sessionToken;

        const quest = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            return this.getQuest(manager, questId);
        })
        if (!quest) {
            this.responseNoBody(404);
            return;
        }

        const questSession = await this.getQuestSession(sessionToken);
        if (!questSession) {
            this.responseNoBody(404);
            return;
        }

        await questSession.delete();
        this.responseNoBody(204);
    }
}

class QuestSessionStore {
    readonly token: string;
    readonly userId: string;

    public questId: string = "";
    public expireAt: number = 0;
    public currentMissionIndex: number = 0;
    public answer: any[] = [];
    public correctResultList: boolean[] = [];

    constructor(token: string, userId: string) {
        this.token = token;
        this.userId = userId;
    }

    public async save(now: Date) {
        this.expireAt = moment(now).add(1, "day").unix(); // TODO: 外に出す
        const redis = this.getRedis();
        const key = this.getRedisKey();
        await redis.set(key, JSON.stringify(this));
        await redis.expireat(key, this.expireAt);
    }

    public async load() {
        const redis = this.getRedis();
        const key = this.getRedisKey();
        const jsonedObj = await redis.get(key);
        if (!jsonedObj) {
            return false;
        }

        const obj = JSON.parse(jsonedObj);
        if (obj.userId !== this.userId) {
            return false;
        }

        this.questId = obj.questId;
        this.expireAt = obj.expireAt;
        this.currentMissionIndex = obj.currentMissionIndex;
        this.answer = obj.answer;
        this.correctResultList = obj.correctResultList;
        return true;
    }

    public async delete() {
        const redis = this.getRedis();
        const key = this.getRedisKey();
        return redis.del(key);
    }

    private getRedis() {
        return RedisConnection.getConnection("questSession");
    }

    private getRedisKey() {
        return "QuestSession::" + this.token; // TODO: 外に出すx
    }

    public static async create(userId: string, questId: string) {
        const token = await Secrets.getTokenUrlBase64(32); // TODO: 外に出す
        const ins = new QuestSessionStore(token, userId);
        ins.questId = questId;
        return ins;
    }
}
