// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";
import moment from "moment";
import Config from "config";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";
import { CommonGetUserHaveRealHandler } from "../../common/real/get_user_have";
import { CommonComsumeUserHaveRealHandler } from "../../common/real/consume";
import {
    callDigicoGiftApi,
    callDigicoGiftReferenceApi,
    createDegicoGiftApiRequestBody,
    createDegicoGiftReferenceApiRequestBody,
    createTradeId,
} from "../degico";
import { CommonUserHandler } from "../../common/user";

import { UserRealHistory } from "../../entity/user_real_history";
import { User } from "../../entity/user";
import { UserDigicoHistory } from "../../entity/user_digico_history";

import type { UserHaveTotalRealType } from "../../common/real/get_user_have";
import type {
    DegicoGiftApiRequestType,
    DegicoGiftApiResponsetype,
    DegicoGiftReferenceApiRequestType,
    DegicoGiftReferenceApiResponsetype,
} from "../degico";

import type {
    paths,
    components,
} from "../../types/api/contents";


type GetUserHaveRealResponseType =
    paths["/user/me/real"]["get"]["responses"][200]["content"]["application/json"];

type GetUserRealHistoryResponseType =
    paths["/user/me/real/history"]["get"]["responses"][200]["content"]["application/json"];
type OneUserRealHistoryType =
    components["schemas"]["oneUserRealHistory"];

type GetUserRealHistoryTargetType = "all" | "addOnly" | "consumeOnly";

type GetOneUserRealHistoryResponseType =
    paths["/user/me/real/{realId}"]["get"]["responses"][200]["content"]["application/json"];

type PostExchangeDigicoRequestType =
    paths["/user/me/real/exchange/digico"]["post"]["requestBody"]["content"]["application/json"];
type PostExchangeDigicoSuccessResponseType =
    paths["/user/me/real/exchange/digico"]["post"]["responses"][200]["content"]["application/json"];
type PostExchangeDigicoFailResponseType =
    paths["/user/me/real/exchange/digico"]["post"]["responses"][409]["content"]["application/json"];

type DigicoModeType = "simulation" | "develop" | "production";

const digicoTestModeResponse: {[key: string]: DegicoGiftApiResponsetype} = {
    "test01": {
        response_code: "NG",
        detail_code: "01",
        message: "NOW MAINTENANCE",
    },
    "test03": {
        response_code: "NG",
        detail_code: "03",
        message: "DUPLICATE TRAN",
    },
    "test04": {
        response_code: "NG",
        detail_code: "04",
        message: "EMPTY GIFT STOCK",
    },
    "test05": {
        response_code: "NG",
        detail_code: "05",
        message: "DAILY CAPACITY OVER",
    },
    "test06": {
        response_code: "NG",
        detail_code: "06",
        message: "MONTHLY CAPACITY OVER",
    },
    "test07": {
        response_code: "NG",
        detail_code: "07",
        message: "ORDER OVER BALANCE",
    },
    "test09": {
        response_code: "NG",
        detail_code: "09",
        message: "RESPONSE TIME_OUT",
    },
    "test21": {
        response_code: "NG",
        detail_code: "21",
        message: "INVALID FORMAT",
    },
    "test23": {
        response_code: "NG",
        detail_code: "23",
        message: "INVALID RESPONSE_TYPE",
    },
    "test24": {
        response_code: "NG",
        detail_code: "24",
        message: "INVALID GIFT_IDENTIFY_CODE",
    },
    "test25": {
        response_code: "NG",
        detail_code: "25",
        message: "INVALID TRADE_ID",
    },
    "test27": {
        response_code: "NG",
        detail_code: "27",
        message: "INVALID TIMESTAMP",
    },
    "test28": {
        response_code: "NG",
        detail_code: "28",
        message: "INVALID SIGNATURE",
    },
    "test99": {
        response_code: "NG",
        detail_code: "99",
        message: "INTERNAL ERROR",
    },
};

const digicoErrorMessage = {
    "01": "現在デジコがメンテナンス中です。時間を開けて再度アクセスしてください。",
    "04": "現在デジコへの交換ができません。時間を開けて再度アクセスしてください。",
    "05": "現在デジコへの交換ができません。時間を開けて再度アクセスしてください。",
    "06": "現在デジコへの交換ができません。時間を開けて再度アクセスしてください。",
    "07": "現在デジコへの交換ができません。時間を開けて再度アクセスしてください。",
    "08": "デジコへの変換に失敗しました。再度やり直してください。",
    "09": "現在デジコへのアクセスが集中しています。時間を開けて再度アクセスしてください。",
    "default": "エラーが発生しました。",
    "onlySimulateMode": "シミュレートモードではエラー扱いです。",
    "coolDown": "現在デジコへの交換ができません。時間を開けて再度アクセスしてください。",
}

export class UserRealAPIController extends BaseAPIController {
    public async getUserHaveReal() {
        const resultUserHaveReal = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            return await CommonGetUserHaveRealHandler.getUserHaveTotalReal(
                manager, this.userId, this.accessDate,
            );
        });

        const userHaveReal = resultUserHaveReal as UserHaveTotalRealType;

        const response: GetUserHaveRealResponseType = {
            haveReal: userHaveReal.haveReal,
            totalAddReal: userHaveReal.totalAddReal,
            totalConsumeReal: userHaveReal.totalConsumeReal,
        };
        this.responseJSON(response);
    }

    public async getUserRealHistory() {
        const target = this.getHistoryTarget();
        const [userRealHistories, total] = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserRealHistory, "urh")
                .leftJoinAndSelect("urh.adaptedExchangeRate", "real_efo_rate")
                .where("urh.userId = :userId");
            if (target === "addOnly") {
                query.andWhere("urh.modifyReal > 0");
            }
            else if (target === "consumeOnly") {
                query.andWhere("urh.modifyReal < 0");
            }
            query.setParameters({
                userId: this.userId,
            });
            this.setOrderByOffsetLimit(
                query, ["createdAt", "updatedAt"], "-createdAt", "urh",
            );
            return await query.getManyAndCount();
        });

        if (userRealHistories.length === 0) {
            const response: GetUserRealHistoryResponseType = {
                histories: [],
                total: total,
            };
            this.responseJSON(response);
            return;
        }

        const userRealHistoryList: OneUserRealHistoryType[] = [];
        for (const history of userRealHistories as UserRealHistory[]) {
            userRealHistoryList.push(this.createOneUserRealHistory(history));
        }

        const response: GetUserRealHistoryResponseType = {
            histories: userRealHistoryList,
            total: total,
        };
        this.responseJSON(response);
    }

    private getHistoryTarget(): GetUserRealHistoryTargetType {
        const target = this.req.query.target;
        if (!target) {
            return "all";
        }
        return target as GetUserRealHistoryTargetType;
    }

    private createOneUserRealHistory(history: UserRealHistory): OneUserRealHistoryType {
        const getAdaptedExchangeRate = () => {
            if (!history.adaptedExchangeRate) {
                return 0;
            }
            return history.adaptedExchangeRate.oneRealToEfo;
        }

        return {
            id: history.outgoingId,
            addReal: history.modifyReal > 0 ? history.modifyReal : 0,
            consumeReal: history.modifyReal < 0 ?  -history.modifyReal : 0,
            reason: history.reason,
            adaptedExchangeRate: getAdaptedExchangeRate(),
            createdAtYear: moment(history.createdAt).format("YYYY"),
            createdAtMonth: moment(history.createdAt).format("MM"),
            createdAtDay: moment(history.createdAt).format("DD"),
            createdAtHour: moment(history.createdAt).format("HH"),
            createdAtMinute: moment(history.createdAt).format("mm"),
            createdAtSecond: moment(history.createdAt).format("ss"),
        }
    }

    public async getOneUserHaveReal() {
        const realId = this.req.params.realId as string;
        const userRealHistory = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(UserRealHistory, "urh")
                .where("urh.userId = :userId and urh.outgoingId = :outgoingId")
                .setParameters({
                    userId: this.userId,
                    outgoingId: realId,
                });
            return await query.getOne();
        });

        if (!userRealHistory) {
            this.responseNoBody(404);
            return;
        }

        const response: GetOneUserRealHistoryResponseType = this.createOneUserRealHistory(userRealHistory as UserRealHistory);
        this.responseJSON(response);
    }

    public async postExchangeDigico() {
        const request = this.req.body as PostExchangeDigicoRequestType;
        const mode = this.getDigicoMode();

        const digicoTradeId = createTradeId();

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            const user = await CommonUserHandler.getUserByUserId(manager, this.userId, false);
            if (!user) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 404,
                    },
                };
            }

            const haveReal = await this.getHaveReal(manager);
            if (haveReal < request.hopeToExchangeDigico) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 409,
                        reason: "notEnoughHavingReal",
                        message: "保有REALが不足しています",
                    },
                };
            }

            const consumeRealInfo = await this.consumeRealByExchangeDigico(
                manager, request, user, digicoTradeId,
            );
            if (!consumeRealInfo.isSuccess) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    error: {
                        status: 409,
                        reason: "notEnoughHavingReal",
                        message: "保有REALが不足しています",
                    },
                };
            }

            let digicoResult;

            switch (mode) {
                case "production": {
                    digicoResult = await this.exchangeDigicoProductionMode(
                        manager, user, request, digicoTradeId,
                    );
                    break;
                }
                case "develop": {
                    digicoResult = await this.exchangeDigicoDevelopMode(
                        manager, user, request, digicoTradeId,
                    );
                    break;
                }
                case "simulation": {
                    digicoResult = await this.exchangeDigicoSimulationMode(
                        manager, user, request, digicoTradeId,
                    );
                    break;
                }
            }

            if (!digicoResult || !digicoResult.isSuccess) {
                await queryRunner.rollbackTransaction();
                return {
                    isError: true,
                    result: digicoResult,
                };
            }

            await queryRunner.commitTransaction();

            return {
                isError: false,
                result: digicoResult,
            }
        });

        if (result.isError) {
            if (result.result && result.result.digico && result.result.digico.response) {
                const response: PostExchangeDigicoFailResponseType = {
                    reason: "errorFromDigico",
                    message: result.result.errorMessage + " (" + result.result.digico.response.detail_code + ")", 
                };
                this.responseJSON(response, 409);
            }
            else if (result.error.status == 409) {
                const response: PostExchangeDigicoFailResponseType = {
                    reason: result.error.reason,
                    message: result.error.message,
                };
                this.responseJSON(response, result.error.status);
            }
            else {
                this.responseNoBody(result.error.status);
            }
            return;
        }

        const response: PostExchangeDigicoSuccessResponseType = {
            digicoCode: result.result.userDigicoHistory.digicoGiftCode,
            digicoUrl: result.result.userDigicoHistory.digicoGiftUrl,
            consumeReal: result.result.userDigicoHistory.consumeReal,
        };
        this.responseJSON(response);
    }

    private getDigicoMode() {
        return Config.get("digico.mode") as DigicoModeType;
    }

    private async getHaveReal(manager: EntityManager) {
        const handler = new CommonGetUserHaveRealHandler(this.userId);
        const haveRealInfo: UserHaveTotalRealType = await handler.getUserHaveTotalRealInDB(manager, this.accessDate);
        return haveRealInfo.haveReal;
    }

    private async consumeRealByExchangeDigico(
        manager: EntityManager,
        request: PostExchangeDigicoRequestType,
        user: User,
        digicoTradeId: string,
    ) {
        const handler = new CommonComsumeUserHaveRealHandler(this.logger, user, request.hopeToExchangeDigico, "exchangeToDigico");
        return handler.consume(manager, this.accessDate, {
            digicoTradeId: digicoTradeId,
        });
    }

    private async execGetDigicoResponse(
        manager: EntityManager,
        user: User,
        request: PostExchangeDigicoRequestType,
        digicoRequest: DegicoGiftApiRequestType,
        digicoResponse: DegicoGiftApiResponsetype
    ) {
        if (digicoResponse.response_code == "OK") {
            this.logger.info({
                digico: {
                    request: digicoRequest,
                    response: digicoResponse,
                }
            }, "success request/response Digico Gift API");
        }
        else {
            this.logger.error({
                digico: {
                    request: digicoRequest,
                    response: digicoResponse,
                },
            }, "fail request/response Digico Gift API");
        }

        if (digicoResponse.response_code == "OK") {
            const userDigicoHistory = await this.successedDigicoApi(
                manager, user, request, digicoResponse,
                digicoRequest.amount, digicoRequest.trade_id, digicoRequest.timestamp,
            );
            return {
                isSuccess: true,
                userDigicoHistory: userDigicoHistory,
                digico: {
                    request: digicoRequest,
                    response: digicoResponse,
                }
            }
        }
        else {
            switch (digicoResponse.detail_code) {
                case "03":
                case "99":
                    break;

                case "01":
                case "04":
                case "05":
                case "06":
                case "07":
                case "08":
                case "09":
                    return {
                        isSuccess: false,
                        digico: {
                            request: digicoRequest,
                            response: digicoResponse,
                        },
                        errorMessage: digicoErrorMessage[digicoResponse.detail_code],
                    };

                case "21":
                case "23":
                case "24":
                case "25":
                case "26":
                case "27":
                case "28":
                default:
                    return {
                        isSuccess: false,
                        digico: {
                            request: digicoRequest,
                            response: digicoResponse,
                        },
                        errorMessage: digicoErrorMessage["default"],
                    };
            }
        }

        // TODO: call gift reference API
        const digicoMode = this.getDigicoMode();
        if (digicoMode == "simulation") {
            return {
                isSuccess: false,
                digico: {
                    request: digicoRequest,
                    response: digicoResponse,
                },
                errorMessage: digicoErrorMessage["onlySimulateMode"],
            };
        }

        const tradeId = digicoRequest.trade_id;
        const resultGiftReferenceApi = await this.callDigicoGiftReferenceApi(request, tradeId);
        const digicoGiftReferenceRequest: DegicoGiftReferenceApiRequestType = resultGiftReferenceApi.request;
        const digicoGiftReferenceResponse: DegicoGiftReferenceApiResponsetype = (await resultGiftReferenceApi.response.json()) as DegicoGiftReferenceApiResponsetype;

        if (digicoGiftReferenceResponse.response_code == "OK") {
            this.logger.info({
                digico: {
                    request: digicoGiftReferenceRequest,
                    response: digicoGiftReferenceResponse,
                }
            }, "success request/response Digico Gift Reference API");
        }
        else {
            this.logger.error({
                digico: {
                    request: digicoGiftReferenceRequest,
                    response: digicoGiftReferenceResponse,
                },
            }, "fail request/response Digico Gift Reference API");
        }

        if (digicoGiftReferenceResponse.response_code == "OK") {
            const userDigicoHistory = await this.successedDigicoApi(
                manager, user, request, digicoGiftReferenceResponse,
                digicoRequest.amount, tradeId, digicoGiftReferenceRequest.timestamp,
            );

            return {
                isSuccess: true,
                userDigicoHistory: userDigicoHistory,
                digico: {
                    request: digicoRequest,
                    response: digicoResponse,
                    reference: {
                        request: digicoGiftReferenceRequest,
                        response: digicoGiftReferenceResponse,
                    },
                },
            };
        }
        else {
            switch (digicoGiftReferenceResponse.detail_code) {
                case "01":
                case "08":
                case "09":
                    return {
                        isSuccess: false,
                        digico: {
                            request: digicoRequest,
                            response: digicoResponse,
                            reference: {
                                request: digicoGiftReferenceRequest,
                                response: digicoGiftReferenceResponse,
                            },
                        },
                        errorMessage: digicoErrorMessage[digicoGiftReferenceResponse.detail_code],
                    };

                case "21":
                case "23":
                case "25":
                case "27":
                case "28":
                default:
                    return {
                        isSuccess: false,
                        digico: {
                            request: digicoRequest,
                            response: digicoResponse,
                            reference: {
                                request: digicoGiftReferenceRequest,
                                response: digicoGiftReferenceResponse,
                            },
                        },
                        errorMessage: digicoErrorMessage["default"],
                    };

            }
        }
    }

    private async successedDigicoApi(
        manager: EntityManager,
        user: User,
        request: PostExchangeDigicoRequestType,
        digicoResponse: DegicoGiftApiResponsetype,
        amount: string,
        tradeId: string,
        timestamp: string,
    ) {
        const digicoGift = digicoResponse.gifts![0];
        const userDigicoHistory = new UserDigicoHistory(user);
        userDigicoHistory.consumeReal = request.hopeToExchangeDigico;
        userDigicoHistory.digicoAmount = parseInt(amount, 10);
        userDigicoHistory.digicoTradeId = tradeId;
        userDigicoHistory.digicoGiftCode = digicoGift.code;
        userDigicoHistory.digicoGiftUrl = digicoGift.url;
        userDigicoHistory.digicoExpireDate = new Date(digicoGift.expire_date);
        userDigicoHistory.digicoManageCode = digicoGift.manage_code;
        userDigicoHistory.digicoSendTime = new Date(digicoGift.send_time);
        userDigicoHistory.digicoRequestedAt = new Date(timestamp);
        userDigicoHistory.digicoGiftIdentifyCode = digicoGift.gift_identify_code;
        userDigicoHistory.digicoRequestedAt = new Date(parseInt(timestamp, 10) * 100);
        await manager.save(userDigicoHistory);
        return userDigicoHistory;
    }

    private async exchangeDigicoSimulationMode(
        manager: EntityManager, user: User, request: PostExchangeDigicoRequestType, digicoTradeId: string
    ) {
        const resultCallDigicoApi = this.responseDigicoSimulationMode(request, digicoTradeId);
        const digicoRequest = resultCallDigicoApi.digico.request;
        const digicoResponse = resultCallDigicoApi.digico.response;

        const result = await this.execGetDigicoResponse(
            manager, user, request, digicoRequest, digicoResponse,
        );
        return result;
    }

    private async exchangeDigicoDevelopMode(
        manager: EntityManager, user: User, request: PostExchangeDigicoRequestType, digicoTradeId: string
    ) {
        let tradeId = digicoTradeId;
        const testMode = this.req.query.testMode as string | undefined;
        const validTestMode = Object.keys(digicoTestModeResponse);
        if (testMode && validTestMode.includes(testMode)) {
            tradeId = testMode;
        }

        const result = await this.callDigicoGiftApi(request, tradeId);
        if (!result.isSuccess) {
            this.logger.error({
                fetch: {
                    request: result.request,
                    response: result.response,
                },
            }, "デジコ発券API エラー");
            // TODO: エラー処理
            return {
                isSuccess: false,
            };
        }

        const digicoResponse = (await result.response.json()) as DegicoGiftApiResponsetype;
        if (digicoResponse.response_code == "NG") {
            // TODO: エラー処理
        }

        const digicoRequest = result.request;
        const resultByResponse = await this.execGetDigicoResponse(
            manager, user, request, digicoRequest, digicoResponse,
        );
        if (!result) {
            return {
                isSuccess: false,
            };
        }
        return resultByResponse;
    }

    private async exchangeDigicoProductionMode(
        manager: EntityManager, user: User, request: PostExchangeDigicoRequestType, digicoTradeId: string,
    ) {
    }

    private async callDigicoGiftApi(request: PostExchangeDigicoRequestType, tradeId: string) {
        const partnerCode = process.env.RL_DEGICO_PARTNERCODE as string;
        const secret = process.env.RL_DEGICO_SECRET as string;
        const requestBody = createDegicoGiftApiRequestBody(
            partnerCode, secret, request.hopeToExchangeDigico, 1, tradeId, this.accessDate
        );
        const response = await callDigicoGiftApi(requestBody.requestBody);
        if (!response.ok) {
            return {
                isSuccess: false,
                response: response,
                request: requestBody.request,
            };
        }

        return {
            isSuccess: true,
            response: response,
            request: requestBody.request,
        };
    }

    private async callDigicoGiftReferenceApi(request: PostExchangeDigicoRequestType, tradeId: string) {
        const partnerCode = process.env.RL_DEGICO_PARTNERCODE as string;
        const secret = process.env.RL_DEGICO_SECRET as string;
        const requestBody = createDegicoGiftReferenceApiRequestBody(
            partnerCode, secret, tradeId, this.accessDate,
        );
        const response = await callDigicoGiftReferenceApi(requestBody.requestBody);
        if (!response.ok) {
            return {
                isSuccess: false,
                response: response,
                request: requestBody.request,
            };
        }

        return {
            isSuccess: true,
            response: response,
            request: requestBody.request,
        };
    }

    private responseDigicoSimulationMode(request: PostExchangeDigicoRequestType, digicoTradeId: string) {
        const testMode = this.req.query.testMode as string | undefined;
        if (!testMode) {
            return this.responseSuccessDigicoSimulationMode(request, digicoTradeId);
        }

        const validTestMode = Object.keys(digicoTestModeResponse);
        if (validTestMode.includes(testMode)) {
            return {
                digico: {
                    request: this.createDummyDigicoRequest(request.hopeToExchangeDigico, digicoTradeId),
                    response: digicoTestModeResponse[testMode],
                },
            };
        }

        return this.responseSuccessDigicoSimulationMode(request, digicoTradeId);
    }

    private createDummyDigicoRequest(consumeReal: number, digicoTradeId: string) {
        const digicoRequest: DegicoGiftApiRequestType = {
            partner_code: "DUMMY_Partner",
            response_type: "json",
            gift_identify_code: consumeReal.toString(),
            amount: "1",
            trade_id: digicoTradeId,
            timestamp: Math.round(new Date().getTime() / 100).toString(),
            signature: "DUMMY_Signature",
        };

        return digicoRequest;
    }
    private responseSuccessDigicoSimulationMode(request: PostExchangeDigicoRequestType, digicoTradeId: string) {
        const digicoRequest = this.createDummyDigicoRequest(request.hopeToExchangeDigico, digicoTradeId);
        const digicoResponse: DegicoGiftApiResponsetype = {
            response_code: "OK",
            detail_code: "00",
            message: "ACCEPT",
            gifts: [
                {
                    gift_identify_code: request.hopeToExchangeDigico,
                    code: "ABCDEFGHIJ01234",
                    url: "https://digi-co.net/",
                    expire_date: moment(this.accessDate).add(30, "day").format("YYYY-MM-DD HH:mm:ss"),
                    manage_code: "MNG_1234567890abcdef",
                    send_time: moment(this.accessDate).format("YYYY-MM-DD HH:mm:ss"),
                },
            ],
        };
        return {
            digico: {
                request: digicoRequest,
                response: digicoResponse,
            },
        };
    }
}
