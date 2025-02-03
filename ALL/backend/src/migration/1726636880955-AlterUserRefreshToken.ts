import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserRefreshToken1726636880955 implements MigrationInterface {
    name = 'AlterUserRefreshToken1726636880955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` ADD \`role\` enum ('admin', 'recruitCompany') NULL`);
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` ADD \`recruitCompanyId\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` DROP COLUMN \`recruitCompanyId\``);
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` DROP COLUMN \`role\``);
    }

}
