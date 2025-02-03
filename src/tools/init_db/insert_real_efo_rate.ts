import { EntityManager } from "typeorm";

import { appDataSource } from "../../data-source";
import RedisConnection from "../../redis";
import { CommonRealEfoRateHandler } from "../../common/real/rate";

import { RealEfoRate } from "../../entity/real_efo_rate";

const rate = 100;
const id = 1;

const main = () => {
    return new Promise(async (resolve, reject) => {
        await appDataSource.initialize();

        await appDataSource.transaction(async (manager: EntityManager) => {
            const query = manager
                .createQueryBuilder()
                .insert()
                .into(RealEfoRate)
                .values({
                    id: id.toString(),
                    oneRealToEfo: rate,
                    isDefaultRate: true,
                })
                .orUpdate(
                    ["id", "oneRealToEfo", "isDefaultRate"],
                    ["id"]
                );
            await query.execute();
        });

        RedisConnection.init();
        await CommonRealEfoRateHandler.clearCache();
        RedisConnection.allClose();

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
