// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";

import { BaseAPIController } from "./base";
import { DBUtil } from "../../utils/db";

import { UserHonor } from "../../entity/user_honor";

import type {
    paths,
    components,
} from "../../types/api/contents";

type GetUserHonorResponse =
    paths["/user/me/honor"]["get"]["responses"][200]["content"]["application/json"];
type OneUserHonor =
    components["schemas"]["oneUserHonor"];

type TypeSetUserHonorRequest =
    paths["/user/me/honor"]["put"]["requestBody"]["content"]["application/json"];

export class UserHonorAPIController extends BaseAPIController {
    public async getHonor() {
        const setHonor = this.req.query.withSetHonor ? true : false;

        const result = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserHonor, "uh")
                .leftJoinAndSelect("uh.honor", "honor")
                .where("uh.userId = :userId")
                .setParameters({
                    userId: this.userId,
                })
                .orderBy("uh.createdAt", "DESC");
            const userHonors = await query.getMany();

            return {
                userHonors: userHonors,
                setHonor: setHonor ? (await this.getSetHonor(manager)) : undefined,
            }
        });
        const total = result.userHonors.length;
        if (total === 0) {
            const response: GetUserHonorResponse = {
                honors: [],
                total: 0,
            };
            this.responseJSON(response);
            return;
        }

        const userHonorList: OneUserHonor[] = [];
        for (const honor of result.userHonors as UserHonor[]) {
            userHonorList.push(this.createOneUserHonor(honor));
        }

        const response: GetUserHonorResponse = {
            honors: userHonorList,
            total: total,
        };
        if (setHonor && result.setHonor) {
            response.setHonor = this.createOneUserHonor(result.setHonor);
        }
        this.responseJSON(response);
    }

    private createOneUserHonor(honor: UserHonor) {
        const createdDate = moment(honor.createdAt);
        return {
            honorId: honor.honor!.id,
            honorName: honor.honor!.name,
            honorDetail: honor.honor!.detail,
            createdAtYear: createdDate.format("YYYY"),
            createdAtMonth: createdDate.format("MM"),
            createdAtDay: createdDate.format("DD"),
            createdAtHour: createdDate.format("HH"),
            createdAtMinute: createdDate.format("mm"),
            createdAtSecond: createdDate.format("ss"),
        };
    }

    private async getSetHonor(manager: EntityManager) {
        const query = manager
            .createQueryBuilder(UserHonor, "uh")
            .leftJoinAndSelect("uh.honor", "honor")
            .where("uh.userId = :userId and isSet = :isSet")
            .setParameters({
                userId: this.userId,
                isSet: true,
            })
            .orderBy("uh.id", "DESC")
            .limit(1);
        return await query.getOne();
    }

    public async setHonor() {
        const request = this.req.body as TypeSetUserHonorRequest;
        const setHonorId = request.honorId;

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const queryGetAllUserHonor = manager
                .createQueryBuilder(UserHonor, "uh")
                .leftJoinAndSelect("uh.honor", "honor")
                .where("uh.userId = :userId")
                .setParameters({
                    userId: this.userId,
                })
                .setLock("pessimistic_write");
            const allUserHonorList = await queryGetAllUserHonor.getMany();
            if (allUserHonorList.length === 0) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "称号を保有していません",
                    },
                };
            }

            const setNewUserHonors = allUserHonorList.filter((v) => v.honor && v.honor.id === setHonorId);
            if (setNewUserHonors.length === 0) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                        reason: "称号を保有していません",
                    },
                };
            }
            const setNewUserHonor = setNewUserHonors[0];

            const currentSetUserHonors = allUserHonorList.filter((v) => v.isSet);
            if (currentSetUserHonors.length > 0) {
                const querydisableIsSetUserHonors = manager
                    .createQueryBuilder()
                    .update(UserHonor)
                    .set({
                        isSet: false,
                    })
                    .where("id in (:userHonorIds)")
                    .setParameters({
                        userHonorIds: currentSetUserHonors.map((v) => v.id),
                    });
                await querydisableIsSetUserHonors.execute();
            }

            setNewUserHonor.isSet = true;
            await manager.save(setNewUserHonor);
            await queryRunner.commitTransaction();

            return {
                isSuccess: true,
            };
        });

        if (result.isError) {
            this.responseNoBody(404);
            return;
        }

        this.responseNoBody(204);
    }
}
