import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserQuestHistory1727937841666 implements MigrationInterface {
    name = 'AlterUserQuestHistory1727937841666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` DROP COLUMN \`score\``);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` ADD \`score\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` DROP COLUMN \`score\``);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` ADD \`score\` datetime NOT NULL`);
    }

}
