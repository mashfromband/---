import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1728965932803 implements MigrationInterface {
    name = 'AlterTable1728965932803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quest\` ADD \`disableBackWrongAnswer\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quest\` DROP COLUMN \`disableBackWrongAnswer\``);
    }

}
