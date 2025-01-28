import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserRefershToken1725859168994 implements MigrationInterface {
    name = 'AlterUserRefershToken1725859168994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` ADD \`isManagementToken\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` DROP COLUMN \`isManagementToken\``);
    }

}
