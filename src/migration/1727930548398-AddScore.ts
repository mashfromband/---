import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScore1727930548398 implements MigrationInterface {
    name = 'AddScore1727930548398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` ADD \`score\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` DROP COLUMN \`score\``);
    }

}
