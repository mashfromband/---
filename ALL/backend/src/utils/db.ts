// -*- coding: utf-8 -*-

import { appDataSource } from "../data-source";

export class DBUtil {
    public static async withTransaction(cb: any) {
        const queryRunner = appDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            return await cb(queryRunner, queryRunner.manager);
        }
        catch(err) {
            await queryRunner.rollbackTransaction();
            throw(err);
        }
        finally {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                throw(new Error("Transaction is not closed."));
            }
            await queryRunner.release();
        }
    }

    public static async getEntityManager(cb: any) {
        const manager = appDataSource.manager;
        try {
            return await cb(manager);
        }
        catch (err) {
            throw(err);
        }
        finally {
        }
    }
}
