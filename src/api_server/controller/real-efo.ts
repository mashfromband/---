// -*- coding: utf-8 -*-

import {
    EntityManager,
} from "typeorm";

import { DBUtil } from "../../utils/db";
import { BaseAPIController } from "./base";
import { CommonRealEfoRateHandler } from "../../common/real/rate";

import type {
    paths,
    components,
} from "../../types/api/contents";
import type { RateInfoType } from "../../common/real/rate";

type GetRealEfoRateResponseType =
    paths["/real-efo/rate"]["get"]["responses"][200]["content"]["application/json"];
type OneRealEfoRateType =
    components["schemas"]["oneRealEfoRate"];

export class RealEfoAPIController extends BaseAPIController {
    public async getRate() {
        const rate: RateInfoType = await DBUtil.getEntityManager(async (manager: EntityManager) => {
            const ins = new CommonRealEfoRateHandler(this.logger);
            return ins.getRate(manager, this.accessDate);
        });

        const defaultRate: OneRealEfoRateType = {
            rate: rate.default.rate,
        };

        const response: GetRealEfoRateResponseType = {
            default: defaultRate,
        };
        this.responseJSON(response);
    }

}
