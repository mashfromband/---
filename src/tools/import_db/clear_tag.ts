// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { appDataSource } from "../../data-source";
import { DBUtil } from "../../utils/db";
import RedisConnection from "../../redis";

import { cacheClear } from "./cache";

import { logger } from "./logger";
import { GenreTag } from "../../entity/genre_tag";
import { CategoryTag } from "../../entity/category_tag";
import { QuestTag } from "../../entity/quest_tag";
import { MissionTag } from "../../entity/mission_tag";
import { Tag } from "../../entity/tag";

const main = () => {
    return new Promise(async (resolve, reject) => {
        RedisConnection.init(logger);
        await appDataSource.initialize();

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            await manager.createQueryBuilder().delete().from(GenreTag).execute();
            await manager.createQueryBuilder().delete().from(CategoryTag).execute();
            await manager.createQueryBuilder().delete().from(QuestTag).execute();
            await manager.createQueryBuilder().delete().from(MissionTag).execute();
            await manager.createQueryBuilder().delete().from(Tag).execute();
            await queryRunner.commitTransaction();
        });

        await cacheClear();

        resolve(true);
    });
}

main().then((result) => {
    appDataSource.destroy();
    RedisConnection.allClose(logger);
    console.log("DONE.");
}).catch((err) => {
    appDataSource.destroy();
    RedisConnection.allClose(logger);
    console.error(err);
});
