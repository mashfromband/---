import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1727079823216 implements MigrationInterface {
    name = 'AlterTable1727079823216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` DROP COLUMN \`name\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` ADD \`name\` varchar(128) NOT NULL`);
    }

}
