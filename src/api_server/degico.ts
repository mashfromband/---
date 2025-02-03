// -*- coding; utf-8 -*-

import Crypto from "node:crypto";

import Config from "config";
import moment from "moment";
import { customAlphabet } from "nanoid";

export type DegicoGiftsType = {
    gift_identify_code: number,
    code: string,
    url: string,
    expire_date: string,
    manage_code: string,
    send_time: string,
}

// ----------------------------------------------------------------------
// デジコ発券API BEGIN
// ----------------------------------------------------------------------
export type DegicoGiftApiRequestType = {
    partner_code: string,
    response_type: "json",
    gift_identify_code: string,
    amount: string,
    trade_id: string,
    timestamp: string,
    signature: string,
}

export type DegicoGiftApiResponsetype = {
    response_code: "OK" | "NG",
    detail_code: string,
    message: string,
    gifts?: DegicoGiftsType[],
}
// ----------------------------------------------------------------------
// デジコ発券API END
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// デジコ発券結果照会API BEGIN
// ----------------------------------------------------------------------
export type DegicoGiftReferenceApiRequestType = {
    partner_code: string,
    response_type: "json",
    trade_id: string,
    timestamp: string,
    signature: string,
}

export type DegicoGiftReferenceApiResponsetype = {
    response_code: "OK" | "NG",
    detail_code: string,
    message: string,
    partner_code?: string,
    trade_id?: string,
    gifts?: DegicoGiftsType[],
}

// ----------------------------------------------------------------------
// デジコ発券結果照会API END
// ----------------------------------------------------------------------

export const callDigicoGiftApi = async (body: string) => {
    const apiEndpoint = Config.get("digico.api.gift.endPoint") as string;
    const options = {
        method: "POST",
        body: body,
        headers: {
            "content-type" : "application/x-www-form-urlencoded"
        },
    };
    return fetch(apiEndpoint, options);
}

export const createDegicoGiftApiRequestBody = (
    partnerCode: string, secret: string, giftIdentifyCode: number, amount: number, tradeId: string, now: Date,
) => {
    const request: DegicoGiftApiRequestType = {
        partner_code: partnerCode,
        response_type: "json",
        gift_identify_code: giftIdentifyCode.toString(),
        amount: amount.toString(),
        timestamp: moment(now).unix().toString(),
        trade_id: tradeId,
        signature: "",
    }

    const paramsList: string[] = [
        "amount=" + request.amount,
        "gift_identify_code=" + request.gift_identify_code,
        "partner_code=" + request.partner_code,
        "response_type=" + request.response_type,
        "timestamp=" + request.timestamp,
        "trade_id=" + request.trade_id,
    ];
    let paramsRawString = paramsList.join("&");
    const encodeParamsString = encodeURIComponent(paramsRawString);
    request.signature = calcSignature(secret, encodeParamsString)
    paramsRawString += "&signature=" + request.signature;

    return {
        requestBody: paramsRawString,
        request: request,
    };
}

export const callDigicoGiftReferenceApi = async (body: string) => {
    const apiEndpoint = Config.get("digico.api.reference.endPoint") as string;
    const options = {
        method: "POST",
        body: body,
        headers: {
            "content-type" : "application/x-www-form-urlencoded"
        },
    };
    return fetch(apiEndpoint, options);
}


export const createDegicoGiftReferenceApiRequestBody = (
    partnerCode: string, secret: string, tradeId: string, now: Date,
) => {
    const request: DegicoGiftReferenceApiRequestType = {
        partner_code: partnerCode,
        response_type: "json",
        trade_id: tradeId,
        timestamp: moment(now).unix().toString(),
        signature: "",
    }

    const paramsList: string[] = [
        "partner_code=" + request.partner_code,
        "response_type=" + request.response_type,
        "timestamp=" + request.timestamp,
        "trade_id=" + request.trade_id,
    ];
    let paramsRawString = paramsList.join("&");
    const encodeParamsString = encodeURIComponent(paramsRawString);
    request.signature = calcSignature(secret, encodeParamsString)
    paramsRawString += "&signature=" + request.signature;

    return {
        requestBody: paramsRawString,
        request: request,
    };
}

const calcSignature = (secret: string, paramsString: string) => {
    const hmac = Crypto.createHmac("sha1", secret);
    hmac.update(paramsString);
    return hmac.digest("hex");
}

export const createTradeId = () => {
    const userChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const nanoid = customAlphabet(userChars, 20);
    return nanoid();
}

// import dotenv from "dotenv";
// dotenv.config();
// const tradeId = createTradeId();
// const degicoGift = createDegicoGiftApiRequestBody(
//     process.env.RL_DEGICO_PARTNERCODE as string,
//     process.env.RL_DEGICO_SECRET as string,
//     100, 1, tradeId, new Date(),
// );
// console.log(degicoGift.requestBody);
