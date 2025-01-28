// -*- coding: utf-8 -*-

import {
    EntityManager,
    QueryRunner,
} from "typeorm";

import { appDataSource } from "../../data-source";
import { DBUtil } from "../../utils/db";
import RedisConnection from "../../redis";

import { importGenreInDB } from "./genre";
import { importCategoryInDB } from "./category";
import { importQuestInDB } from "./quest";
import { importMissionInDB } from "./mission";
import { importGenreCategoryInDB } from "./genre_category";
import { importCategoryQuestInDB } from "./category_quest";
import { importSkillInDB } from "./skill";
import { importSkillDomainInDB } from "./skill_domain";

import { cacheClear } from "./cache";

import { logger } from "./logger";

const main = () => {
    return new Promise(async (resolve, reject) => {
        RedisConnection.init(logger);
        await appDataSource.initialize();

        const result = await DBUtil.withTransaction(async (queryRunner: QueryRunner, manager: EntityManager) => {
            await importSkillInDB(queryRunner, manager);
            await importSkillDomainInDB(queryRunner, manager);

            await importGenreInDB(queryRunner, manager);
            await importCategoryInDB(queryRunner, manager);
            await importQuestInDB(queryRunner, manager);
            await importMissionInDB(queryRunner, manager);
            await importGenreCategoryInDB(queryRunner, manager);
            await importCategoryQuestInDB(queryRunner, manager);
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
