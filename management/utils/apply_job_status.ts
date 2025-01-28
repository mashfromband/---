// -*- coding: utf-8 -*-

export type MessageRoomApplyJobStatus =
    "applyJobFromUser" | // ユーザーから求人広告に応募あり
    "offerFromRecruitCompany" | // 求人企業側からオファーあり
    "beforeDocumentScreening" | // 書類選考前
    "documentScreening" | // 書類選考中
    "beforeInterview" | // 面接前
    "afterInterview" | // 面接後
    "employment" | // 採用
    "rejection" | // 不採用
    "cancel" | // キャンセル
    "unknown"; // 不明

const applyJobStatus2Name = new Map<MessageRoomApplyJobStatus, string>([
    ["applyJobFromUser", "ユーザーから求人広告に応募あり"],
    ["offerFromRecruitCompany", "求人企業側からオファーあり"],
    ["beforeDocumentScreening", "書類選考前"],
    ["documentScreening", "書類選考中"],
    ["beforeInterview", "面接前"],
    ["afterInterview", "面接後"],
    ["employment", "採用"],
    ["rejection", "不採用"],
    ["cancel", "キャンセル"],
    ["unknown", "不明"],
]);

export const getApplyJobStatusName = (status: MessageRoomApplyJobStatus) => {
    return applyJobStatus2Name.get(status);
}

export const getAllApplyJopStatus = () => {
    return applyJobStatus2Name;
}
