import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1728456235399 implements MigrationInterface {
    name = 'AlterTable1728456235399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_results\` ADD \`playQuestCount\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_results\` ADD \`totalAnswerCount\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user_results\` ADD \`totalCorrectAnswerCount\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_results\` DROP COLUMN \`totalCorrectAnswerCount\``);
        await queryRunner.query(`ALTER TABLE \`user_results\` DROP COLUMN \`totalAnswerCount\``);
        await queryRunner.query(`ALTER TABLE \`user_results\` DROP COLUMN \`playQuestCount\``);
    }

}
