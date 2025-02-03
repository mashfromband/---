import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAndAlterUserEfoTables1730267887620 implements MigrationInterface {
    name = 'CreateAndAlterUserEfoTables1730267887620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_efo\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`addEfo\` int NOT NULL DEFAULT '0', \`consumeEfo\` int NOT NULL DEFAULT '0', \`type\` enum ('questClear', 'free') NOT NULL, \`expireDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` DROP COLUMN \`addEfo\``);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` DROP COLUMN \`consumeEfo\``);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` ADD \`modifyEfo\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_efo\` ADD CONSTRAINT \`FK_87396dd80ebd28659826f5b0a6f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_efo\` DROP FOREIGN KEY \`FK_87396dd80ebd28659826f5b0a6f\``);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` DROP COLUMN \`modifyEfo\``);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` ADD \`type\` enum ('free') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` ADD \`consumeEfo\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` ADD \`addEfo\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE \`user_efo\``);
    }

}
