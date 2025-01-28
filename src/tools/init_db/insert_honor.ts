import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";

import { Honor } from "../../entity/honor";

const insertHonorList = [
    {
        id: "trailblazerBronze",
        name: "Trailblazer Bronze",
        detail: "クラウドファンディングの返礼品です",
    },
    {
        id: "trailblazerSilver",
        name: "Trailblazer Silver",
        detail: "クラウドファンディングの返礼品です",
    },
    {
        id: "trailblazerGold",
        name: "Trailblazer Gold",
        detail: "クラウドファンディングの返礼品です",
    },
];

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const promiseList = [];
            for (const honor of insertHonorList) {
                const query = manager
                    .createQueryBuilder()
                    .insert()
                    .into(Honor)
                    .values({
                        id: honor.id,
                        name: honor.name,
                        detail: honor.detail,
                        deletedAt: null,
                    })
                    .orUpdate(
                        ["name", "detail", "deletedAt"],
                        ["id"],
                    );
                promiseList.push(query.execute());
            }

            await Promise.all(promiseList);
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
