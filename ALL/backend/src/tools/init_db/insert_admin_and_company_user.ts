import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";
import { User } from "../../entity/user";
import { MailAuthPasswordHash } from "../../auth_server/controller/auth/mail/common/password_hash";
import { UserProfile } from "../../entity/user_profile";
import { RecruitCompany } from "../../entity/recruit_company";
import { UserRecruitCompany } from "../../entity/user_recruit_company";
import { UserRole } from "../../entity/user_role";
import { UserPrivateProfile } from "../../entity/user_private_profile";

const adminUser = {
    mailAddress: "admin_user@example.com",
    password: "RealizeLearning",
    nickName: "ダミー管理者",
};

const recruitCompanyUserList = [
    {
        mailAddress: "company_user_1@example.com",
        password: "RealizeLearning",
        nickName: "ダミー企業ユーザー1",
        companyName: "株式会社ABC",
    },
    {
        mailAddress: "company_user_2@example.com",
        password: "RealizeLearning",
        nickName: "ダミー企業ユーザー2",
        companyName: "株式会社DEF",
    },
    {
        mailAddress: "company_user_3@example.com",
        password: "RealizeLearning",
        nickName: "ダミー企業ユーザー3",
        companyName: "XYZ有限会社",
    },
];

const insertAdminUser = async (manager: EntityManager) => {
    const { user, profile } = await createUser(
        manager, adminUser.mailAddress, adminUser.password, adminUser.nickName
    );

    const newRole = new UserRole(user, "admin");
    await manager.save(newRole);
}

const createUser = async (manager: EntityManager, mailAddress: string, password: string, nickName: string) => {
    const hashedPassword = await MailAuthPasswordHash.create(adminUser.password);
    const newUser = new User(mailAddress, hashedPassword);
    await manager.save(newUser);

    const newUserProfile = new UserProfile(newUser, nickName);
    await manager.save(newUserProfile);

    const newUserPrivateProfile = new UserPrivateProfile(newUser);
    await manager.save(newUserPrivateProfile);

    return {
        user: newUser,
        profile: newUserProfile,
        private: newUserPrivateProfile,
    };
}

const insertRecruitCompanyUsers = async (manager: EntityManager) => {
    for (const recruitCompanyUser of recruitCompanyUserList) {
        const { user, profile } = await createUser(
            manager, recruitCompanyUser.mailAddress, recruitCompanyUser.password, recruitCompanyUser.nickName,
        );

        const newRole = new UserRole(user, "recruitCompany");
        await manager.save(newRole);
    
        const query = manager
            .createQueryBuilder(RecruitCompany, "rc")
            .where("rc.name = :companyName")
            .setParameters({
                companyName: recruitCompanyUser.companyName,
            });
        const company = await query.getOne();
        if (!company) {
            continue;
        }

        const userRecruitCompany = new UserRecruitCompany(user, company);
        await manager.save(userRecruitCompany);
    }
}

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            await insertAdminUser(manager);
            await insertRecruitCompanyUsers(manager);
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
