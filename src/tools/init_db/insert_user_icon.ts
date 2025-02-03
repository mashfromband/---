import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";

import { UserIcon } from "../../entity/user_icon";

const insertUserIconList = [
    {
        id: 1,
        iconPath: "/img/avator/preset/icon01.png",
    },
    {
        id: 2,
        iconPath: "/img/avator/preset/icon02.png",
    },
    {
        id: 3,
        iconPath: "/img/avator/preset/icon03.png",
    },
    {
        id: 4,
        iconPath: "/img/avator/preset/icon04.png",
    },
    {
        id: 5,
        iconPath: "/img/avator/preset/icon05.png",
    },
    {
        id: 6,
        iconPath: "/img/avator/preset/icon06.png",
    },
    {
        id: 7,
        iconPath: "/img/avator/preset/icon07.png",
    },
    {
        id: 8,
        iconPath: "/img/avator/preset/icon08.png",
    },
];

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const promiseList = [];

            for (const userIcon of insertUserIconList) {
                const query = manager
                    .createQueryBuilder()
                    .insert()
                    .into(UserIcon)
                    .values({
                        id: userIcon.id,
                        iconPath: userIcon.iconPath,
                    })
                    .orUpdate(
                        ["id", "iconPath"],
                        ["id"]
                    );
                promiseList.push(query.execute());
            }

            return Promise.all(promiseList);
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
