import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1730096566759 implements MigrationInterface {
    name = 'AlterTable1730096566759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP FOREIGN KEY \`FK_dcf183985136522a08023d5ee07\``);
        await queryRunner.query(`ALTER TABLE \`real_efo_rate\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`real_efo_rate\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`real_efo_rate\` ADD \`id\` bigint NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`adaptedExchangeRateId\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`adaptedExchangeRateId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD CONSTRAINT \`FK_dcf183985136522a08023d5ee07\` FOREIGN KEY (\`adaptedExchangeRateId\`) REFERENCES \`real_efo_rate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP FOREIGN KEY \`FK_dcf183985136522a08023d5ee07\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`adaptedExchangeRateId\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`adaptedExchangeRateId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`real_efo_rate\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`real_efo_rate\` ADD \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`real_efo_rate\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD CONSTRAINT \`FK_dcf183985136522a08023d5ee07\` FOREIGN KEY (\`adaptedExchangeRateId\`) REFERENCES \`real_efo_rate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
