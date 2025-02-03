import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1727081271729 implements MigrationInterface {
    name = 'AlterTable1727081271729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`parentCategoryId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`rootCategoryId\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`rootCategoryId\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`parentCategoryId\``);
    }

}
