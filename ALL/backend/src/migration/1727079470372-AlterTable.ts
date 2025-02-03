import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1727079470372 implements MigrationInterface {
    name = 'AlterTable1727079470372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` DROP COLUMN \`score\``);
        await queryRunner.query(`ALTER TABLE \`mission\` ADD \`answerType\` enum ('one_choice', 'multi_choice') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mission\` ADD \`correct\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` DROP COLUMN \`correct\``);
        await queryRunner.query(`ALTER TABLE \`mission\` DROP COLUMN \`answerType\``);
        await queryRunner.query(`ALTER TABLE \`mission\` ADD \`score\` int NOT NULL`);
    }

}
