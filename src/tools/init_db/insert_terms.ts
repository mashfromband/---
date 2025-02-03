import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";

import { Term } from "../../entity/term";

const insertTermList = [
    {
        name: "利用規約",
        version: 1,
    },
    {
        name: "プライバシーポリシー",
        version: 1,
    },
];

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const termList: Term[] = [];
            for (const term of insertTermList) {
                const newTerm = new Term(term.name, term.version);
                termList.push(newTerm);
            }
            await manager.save(termList);
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
