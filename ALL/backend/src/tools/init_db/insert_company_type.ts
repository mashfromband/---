import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";

import { CompanyType } from "../../entity/company_type";

const insertCompanyTypeList = [
    {
        id: 0,
        name: "未設定",
    },
    {
        id: 1,
        name: "株式会社",
    },
    {
        id: 2,
        name: "合同会社",
    },
    {
        id: 3,
        name: "合資会社",
    },
    {
        id: 4,
        name: "合名会社",
    },
    {
        id: 5,
        name: "有限会社",
    },
    {
        id: 6,
        name: "NPO法人",
    },
    {
        id: 7,
        name: "一般社団法人",
    },
    {
        id: 8,
        name: "一般財団法人",
    },
    {
        id: 9,
        name: "学校法人",
    },
    {
        id: 10,
        name: "国立大学法人",
    },
    {
        id: 11,
        name: "国・地方自治体",
    },
    {
        id: 99,
        name: "その他",
    },
];

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const comapanyTypeList: CompanyType[] = [];
            for (const companyType of insertCompanyTypeList) {
                const ct = new CompanyType(companyType.id, companyType.name);
                comapanyTypeList.push(ct);
            }
            await manager.save(comapanyTypeList);
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
