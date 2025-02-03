import { EntityManager } from "typeorm";
import moment from "moment";

import { appDataSource } from "../../data-source";

import { CompanyType } from "../../entity/company_type";
import { RecruitCompany } from "../../entity/recruit_company";
import { RecruitCompanyInfo } from "../../entity/recruit_company_info";
import { RecruitCompanyWantedAds } from "../../entity/recruit_company_wanted_ads";

const insertCompanyList = [
    {
        name: "株式会社ABC",
        beginPeriodAt: "2024-04-01",
        endPeriodAt: "2025-04-01",
        displayName: "株式会社ABC",
        establishmentDate: "2000-04-01",
        postalCode: "1234567",
        prefectureCode: 13,
        address: "〇〇区●●町1-2-3",
        phoneNumber: "0123456789",
        faxNumber: "0123456798",
        officialSiteUrl: "https://www.example.com/",
        profile: "アットホームな会社です",
        employees: "社員100人 (○○○○年●月現在)",
        netSales: "売上高○◯◯百万円 営業利益○◯百万円",
        contactPersonName: "担当太郎",
        contactPersonPosition: "人事",
        contactPersonPhoneNumber: "0123456789",
        contactPersionMailAddress: "tantou@example.com",
        companyTypeId: 1,
    },
    {
        name: "株式会社DEF",
        beginPeriodAt: "2024-04-01",
        endPeriodAt: "2025-04-01",
        displayName: "株式会社DEF",
        establishmentDate: "2020-04-01",
        postalCode: "9876543",
        prefectureCode: 1,
        address: "〇〇市●●町1000-1 △△ビル 4F",
        phoneNumber: "9876543210",
        faxNumber: "9876543210",
        officialSiteUrl: "https://www.example.net/",
        profile: "北の大地に生きる会社です",
        employees: "社員300人 (○○○○年●月現在)",
        netSales: "売上高○◯◯百万円 営業利益○◯百万円",
        contactPersonName: "担当次郎",
        contactPersonPosition: "人事部採用担当",
        contactPersonPhoneNumber: "9876543210",
        contactPersionMailAddress: "tantou@example.net",
        companyTypeId: 1,
    },
    {
        name: "XYZ有限会社",
        beginPeriodAt: "2024-04-01",
        endPeriodAt: "2025-04-01",
        displayName: "XYZ!",
        establishmentDate: "1950-09-01",
        postalCode: "5431234",
        prefectureCode: 40,
        address: "〇〇市□□区●●3-2-1 △△ビル",
        phoneNumber: "0918273645",
        faxNumber: "0918273654",
        officialSiteUrl: "https://www.example.org/",
        profile: "九州の会社です",
        employees: "社員50人 (○○○○年●月現在)",
        netSales: "売上高◯◯百万円 営業利益◯百万円",
        contactPersonName: "担当三郎",
        contactPersonPosition: "採用担当",
        contactPersonPhoneNumber: "0918273645",
        contactPersionMailAddress: "tantou@example.org",
        companyTypeId: 5,
    },
];

const insertAds = [
    {
        title: "スマホ向けゲームプロデューサー求む",
        position: "プロデューサー",
        workLocation: "東京(九段下)",
        employmentStatus: "正社員(試用期間6ヶ月)",
        numberOfPeople: "若干名",
        details: "市場分析、IP戦略およびコンテンツ戦略の立案\n社内外のアライアンス、渉外対応\nプロモーションにおける監修、リソース及び予算管理\n品質と納期、予算のバランスを精査\n制作スケジュールの進捗管理および会議管理\n制作に関わる各部門との連携業務全般\nプロモーションチームとの連携業務全般",
        requirements: "家庭用ゲーム/オンラインゲーム/ソーシャルゲームのプロデュース経験",
        salaryAndBenefits: "経験・年齢・スキル・資格等を考慮の上、当社規定により決定(年俸制)",
        officeHour: "10:00～18:30",
        dayOff: "完全週休2日制(日曜日、土曜日)、祝日 年次有給休暇、夏季休暇、年末年始休暇",
        welfareProgram: "社保完備",
        howToApply: "応募書類をメールでお送りください。",
        applicationDocuments: "履歴書(写真付)、職務経歴書",
        applicationDeadline: "2025-03-31",
        beginAt: "2024-04-01",
        endAt: "2025-04-01",
    },
    {
        title: "北の大地で働いてみませんか? 営業マネージャー募集",
        position: "マネージャー(営業)",
        workLocation: "札幌(本社)",
        employmentStatus: "正社員(試用期間3ヶ月)",
        numberOfPeople: "若干名",
        details: "ブランディング、マーケティング戦略立案\nHP、SNS運用関連業務\n各種イベントの企画運営",
        requirements: "営業実務2年以上",
        salaryAndBenefits: "経験・年齢・スキル・資格等を考慮の上、当社規定により決定(年俸制)",
        officeHour: "10:00～18:30",
        dayOff: "完全週休2日制(日曜日、土曜日)、祝日 年次有給休暇、夏季休暇、年末年始休暇",
        welfareProgram: "健康保険、厚生年金保険、雇用保険、労災保険、定期健康診断、育休産休制度",
        howToApply: "応募書類をメールでお送りください。",
        applicationDocuments: "履歴書(写真付)、職務経歴書",
        applicationDeadline: "2025-03-31",
        beginAt: "2024-04-01",
        endAt: "2025-04-01",
    },
    {
        title: "焼鳥職人求む",
        position: "焼き場担当",
        workLocation: "福岡(天神)",
        employmentStatus: "契約社員(試用期間6ヶ月)、正社員登用あり",
        numberOfPeople: "10名",
        details: "焼き鳥を焼くお仕事です。焼きを極めてみませんか?",
        requirements: "経験なし大歓迎",
        salaryAndBenefits: "月給18万〜",
        officeHour: "15:00-23:30",
        dayOff: "週休2日制 年次有給休暇",
        welfareProgram: "健康保険、厚生年金保険、雇用保険、労災保険",
        howToApply: "応募書類をメールでお送りください。",
        applicationDocuments: "履歴書(写真付)",
        applicationDeadline: "2025-03-31",
        beginAt: "2024-04-01",
        endAt: "2025-04-01",
    },
];

const insertRecruitCompany = async (manager: EntityManager) => {
    const recruitCompanyList = [];
    const recruitCompanyInfoList = [];

    for (const company of insertCompanyList) {
        const companyType = await manager
            .createQueryBuilder(CompanyType, "ct")
            .where("ct.id = :companyTypeId")
            .setParameters({
                companyTypeId: company.companyTypeId,
            })
            .getOneOrFail();

        const recruitCompany = new RecruitCompany(company.name);
        recruitCompany.beginPeriodAt = moment(company.beginPeriodAt).toDate();
        recruitCompany.endPeriodAt = moment(company.endPeriodAt).toDate();
        const newRecruitCompany = await manager.save(recruitCompany);
        recruitCompanyList.push(newRecruitCompany);

        const recruitCompanyInfo = new RecruitCompanyInfo(newRecruitCompany);
        recruitCompanyInfo.companyType = companyType;
        recruitCompanyInfo.address = company.address;
        recruitCompanyInfo.contactPersionMailAddress = company.contactPersionMailAddress;
        recruitCompanyInfo.contactPersonName = company.contactPersonName;
        recruitCompanyInfo.contactPersonPhoneNumber = company.contactPersonPhoneNumber;
        recruitCompanyInfo.contactPersonPosition = company.contactPersonPosition;
        recruitCompanyInfo.displayName = company.displayName;
        recruitCompanyInfo.employees = company.employees;
        recruitCompanyInfo.establishmentDate = moment(company.establishmentDate).toDate();
        recruitCompanyInfo.faxNumber = company.faxNumber;
        recruitCompanyInfo.netSales = company.netSales;
        recruitCompanyInfo.officialSiteUrl = company.officialSiteUrl;
        recruitCompanyInfo.phoneNumber = company.phoneNumber;
        recruitCompanyInfo.postalCode = company.postalCode;
        recruitCompanyInfo.prefectureCode = company.prefectureCode;
        recruitCompanyInfo.profile = company.profile;
        const newRecruitCompanyInfo = await manager.save(recruitCompanyInfo);
        recruitCompanyInfoList.push(newRecruitCompanyInfo);
    }

    return {
        recruitCompanyList, recruitCompanyInfoList,
    };
}

const insertRecruitCompanyWantedAds = async (
    manager: EntityManager, recruitCompanyList: RecruitCompany[]
) => {
    const recruitCompanyWantedAdsList = [];

    for (let i = 0; i < insertAds.length; i++) {
        const ads = insertAds[i];

        const recruitCompanyWantedAds = new RecruitCompanyWantedAds(recruitCompanyList[i]);
        recruitCompanyWantedAds.applicationDeadline = moment(ads.applicationDeadline).toDate();
        recruitCompanyWantedAds.applicationDocuments = ads.applicationDocuments;
        recruitCompanyWantedAds.beginAt = moment(ads.beginAt).toDate();
        recruitCompanyWantedAds.endAt = moment(ads.endAt).toDate();
        recruitCompanyWantedAds.dayOff = ads.dayOff;
        recruitCompanyWantedAds.details = ads.details;
        recruitCompanyWantedAds.employmentStatus = ads.employmentStatus;
        recruitCompanyWantedAds.howToApply = ads.howToApply;
        recruitCompanyWantedAds.numberOfPeople = ads.numberOfPeople;
        recruitCompanyWantedAds.officeHour = ads.officeHour;
        recruitCompanyWantedAds.position = ads.position;
        recruitCompanyWantedAds.requirements = ads.requirements;
        recruitCompanyWantedAds.salaryAndBenefits = ads.salaryAndBenefits;
        recruitCompanyWantedAds.title = ads.title;
        recruitCompanyWantedAds.welfareProgram = ads.welfareProgram;
        recruitCompanyWantedAds.workLocation = ads.workLocation;
        const newRecruitCompanyWantedAds = await manager.save(recruitCompanyWantedAds);
        recruitCompanyWantedAdsList.push(newRecruitCompanyWantedAds);
    }

    return recruitCompanyWantedAdsList;
}

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const {
                recruitCompanyList, recruitCompanyInfoList
            } = await insertRecruitCompany(manager);

            const recruitCompanyWantedAdsList = await insertRecruitCompanyWantedAds(
                manager, recruitCompanyList
            );
        });

        resolve(true);
    });
}

main().then((result) => {
    console.log("DONE.");
    appDataSource.destroy();
}).catch((err) => {
    console.error(err);
    appDataSource.destroy();
});
