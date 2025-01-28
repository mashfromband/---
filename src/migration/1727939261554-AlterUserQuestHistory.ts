import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserQuestHistory1727939261554 implements MigrationInterface {
    name = 'AlterUserQuestHistory1727939261554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` ADD \`outgoingId\` varchar(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` ADD UNIQUE INDEX \`IDX_22fa09ba0e00835ee73a52ec83\` (\`outgoingId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` DROP INDEX \`IDX_22fa09ba0e00835ee73a52ec83\``);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` DROP COLUMN \`outgoingId\``);
    }

}
