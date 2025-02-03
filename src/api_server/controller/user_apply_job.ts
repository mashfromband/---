// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";
import { CommonMessageHandler } from "../../common/message";

import type {
    paths,
    components,
} from "../../types/api/contents";

import { RecruitCompanyWantedAds } from "../../entity/recruit_company_wanted_ads";
import { UserRecruitCompany } from "../../entity/user_recruit_company";

import type { MessageRoomUserType } from "../../entity/message_room";
import { CommonUserHandler } from "../../common/user";

export class UserApplyJobAPIController extends BaseAPIController {
    public async applyJob() {
        const wantedAdsId = this.req.params.wantedAdsId as string;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByUserIdWithProfile(manager, this.userId, false);
            if (!user || !user.profile) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: '存在しないユーザーです',
                    },
                };
            }

            const queryGetWantedAds = manager
                .createQueryBuilder(RecruitCompanyWantedAds, "rcwa")
                .leftJoinAndSelect("rcwa.recruteCompany", "recruit_company")
                .where("rcwa.outgoingId = :wantedAdsId and rcwa.beginAt <= :now and rcwa.endAt > :now")
                .andWhere("recruit_company.beginPeriodAt <= :now and recruit_company.endPeriodAt > :now")
                .setParameters({
                    wantedAdsId: wantedAdsId,
                    now: this.accessDate,
                });
            const wantedAds = await queryGetWantedAds.getOne();
            if (!wantedAds || !wantedAds.recruteCompany) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: '存在しない求人広告です',
                    },
                };
            }

            const recruitCompanyId = wantedAds.recruteCompany.id;

            const queryGetRecvRecruitCompanyUser = manager
                .createQueryBuilder(UserRecruitCompany, "urc")
                .leftJoinAndSelect("urc.user", "user")
                .where("urc.recruteCompanyId = :recruitCompanyId and urc.receverApplyJobFromUser = :receverApplyJobFromUser")
                .setParameters({
                    recruitCompanyId: recruitCompanyId,
                    receverApplyJobFromUser: true,
                })
                .orderBy("urc.id", "DESC")
                .limit(1);
            const recvRecruitCompanyUser = await queryGetRecvRecruitCompanyUser.getOne();
            if (!recvRecruitCompanyUser || !recvRecruitCompanyUser.user) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "受取ユーザーが指定されていません",
                    },
                };
            }

            const recvCompanyUser = recvRecruitCompanyUser.user;

            const messageRoom = await CommonMessageHandler.createMessageRoom(
                manager,
                {
                    owner: {
                        userId: this.userId,
                        userType: "normal",
                    },
                    invited: {
                        userId: recvCompanyUser.id,
                        userType: "recruitCompany",
                        recruitCompanyId: recruitCompanyId,
                    },
                    applyJobStatus: "applyJobFromUser",
                    recruitCompanyWantedAdsId: wantedAds.id,
                },
            );

            const separater = "--------------------------------------------------------";
            const postBodyList = [
                user.profile.nickname + " さんが求人「" + wantedAds.title + "」に応募しました",
                separater,
                "ユーザーID " + user.outgoingId,
                "求人広告ID " + wantedAdsId,
                "求人企業ID " + wantedAds.recruteCompany.outgoingId,
                "求人企業名 " + wantedAds.recruteCompany.name,
                separater,
            ];
            const postBody = postBodyList.join("\n");

            const wantedAdsInfo = this.createWantedAdsInfo(wantedAds) + "\n" + separater;

            const postMessageRoom = await CommonMessageHandler.postMessage(
                manager,
                messageRoom,
                user,
                postBody + "\n" + wantedAdsInfo,
            );

            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
            };
        });

        if (result.isError) {
            this.responseNoBody(result.error.status);
            return;
        }

        this.responseNoBody(204);
    }

    private createWantedAdsInfo(wantedAds: RecruitCompanyWantedAds) {
        const infoMap = new Map<string, string>();
        infoMap.set("タイトル", wantedAds.title);
        infoMap.set("募集職種", wantedAds.position);
        infoMap.set("勤務地", wantedAds.workLocation);
        infoMap.set("雇用形態", wantedAds.employmentStatus);
        infoMap.set("募集人数", wantedAds.numberOfPeople);
        infoMap.set("仕事内容の詳細", wantedAds.details);
        infoMap.set("応募条件", wantedAds.requirements);
        infoMap.set("給与・待遇", wantedAds.salaryAndBenefits);
        infoMap.set("勤務時間", wantedAds.officeHour);
        infoMap.set("休日・休暇", wantedAds.dayOff);
        infoMap.set("福利厚生", wantedAds.welfareProgram);
        infoMap.set("応募方法", wantedAds.howToApply);
        infoMap.set("応募書類", wantedAds.applicationDocuments);
        infoMap.set("応募締切日", moment(wantedAds.applicationDeadline).format("YYYY-MM-DD"));

        const wantedAdsInfoList: string[] = [];
        for (const [key, value] of infoMap) {
            wantedAdsInfoList.push("■" + key);
            wantedAdsInfoList.push(value);
        }

        return wantedAdsInfoList.join("\n");
    }
}
