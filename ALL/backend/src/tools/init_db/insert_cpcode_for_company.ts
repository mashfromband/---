import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";
import { User } from "../../entity/user";
import { MailAuthPasswordHash } from "../../auth_server/controller/auth/mail/common/password_hash";
import { UserProfile } from "../../entity/user_profile";
import { RecruitCompany } from "../../entity/recruit_company";
import { UserRecruitCompany } from "../../entity/user_recruit_company";
import { UserRole } from "../../entity/user_role";
import { UserPrivateProfile } from "../../entity/user_private_profile";
import { RecruitCompanyCode } from "../../entity/recruit_company_code";
import moment from "moment";

const recruitCompanyCpcodeList = [
    {
        companyName: "株式会社ABC",
        cpcode: "CP1000000001",
    },
    {
        companyName: "株式会社DEF",
        cpcode: "CP1000000002",
    },
    {
        companyName: "XYZ有限会社",
        cpcode: "CP1000000003",
    },
];

const generateCpcode = () => {
    const random: string[] = [];
    for (let i = 0; i < 9; i++) {
        random.push(Math.floor(Math.random() * 10).toString());
    }
    return "CP1" + random.join("");
}

const insertCpcode = async (manager: EntityManager) => {
    const recruitCompanyList = await manager
        .createQueryBuilder(RecruitCompany, "rc")
        .getMany();
    
    for (const company of recruitCompanyList) {
        const cpcode = recruitCompanyCpcodeList.filter(v => v.companyName === company.name);
        if (cpcode.length === 1) {
            const recruitCompanyCode = new RecruitCompanyCode(company, cpcode[0].cpcode);
            await manager.save(recruitCompanyCode);
        }
        else {
            const recruitCompanyCode = new RecruitCompanyCode(company, generateCpcode());
            await manager.save(recruitCompanyCode);
        }
    }
}

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            await insertCpcode(manager);
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
