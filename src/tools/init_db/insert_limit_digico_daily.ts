import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";

import { DigicoLimit } from "../../entity/digico_limit";

const maxExchangeDigicoDaily = 10000;

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder(DigicoLimit, "dl")
                .setLock("pessimistic_write");
            let digicoLimit = await query.getOne();
            if (!digicoLimit) {
                digicoLimit = new DigicoLimit(maxExchangeDigicoDaily);
            }
            else {
                digicoLimit.limitExchangeDigicoDaily = maxExchangeDigicoDaily;
            }
            await manager.save(digicoLimit);
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
