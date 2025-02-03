import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAndAlterUserRealTables1730270959353 implements MigrationInterface {
    name = 'CreateAndAlterUserRealTables1730270959353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_real\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`addReal\` int NOT NULL DEFAULT '0', \`consumeReal\` int NOT NULL DEFAULT '0', \`type\` enum ('normal') NOT NULL DEFAULT 'normal', \`incomingTransactionId\` varchar(32) NULL, \`expireDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`addReal\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`consumeReal\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`modifyReal\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_real\` ADD CONSTRAINT \`FK_dd900ecfdea774a582167a7abc6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_real\` DROP FOREIGN KEY \`FK_dd900ecfdea774a582167a7abc6\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`modifyReal\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`type\` enum ('normal') NOT NULL DEFAULT 'normal'`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`consumeReal\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`addReal\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE \`user_real\``);
    }

}
