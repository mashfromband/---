import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDigicoTables1731217102572 implements MigrationInterface {
    name = 'CreateDigicoTables1731217102572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`exchange_digico_daily\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`targetDate\` datetime NOT NULL, \`totalExchangeDigico\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_6388fd72182896c58bc1f39746\` (\`targetDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`digico_limit\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`limitExchangeDigicoDaily\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`digico_limit\``);
        await queryRunner.query(`DROP INDEX \`IDX_6388fd72182896c58bc1f39746\` ON \`exchange_digico_daily\``);
        await queryRunner.query(`DROP TABLE \`exchange_digico_daily\``);
    }

}
