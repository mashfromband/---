import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1727846565111 implements MigrationInterface {
    name = 'AlterTable1727846565111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`parentCategoryId\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`parentCategoryId\` char(38) NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`rootCategoryId\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`rootCategoryId\` char(38) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`rootCategoryId\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`rootCategoryId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`parentCategoryId\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`parentCategoryId\` varchar(36) NULL`);
    }

}
