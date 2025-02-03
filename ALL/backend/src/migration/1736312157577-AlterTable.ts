import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1736312157577 implements MigrationInterface {
    name = 'AlterTable1736312157577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_recruit_company\` ADD \`receverApplyJobFromUser\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_recruit_company\` DROP COLUMN \`receverApplyJobFromUser\``);
    }

}
