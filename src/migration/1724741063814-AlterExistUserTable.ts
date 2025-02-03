import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterExistUserTable1724741063814 implements MigrationInterface {
    name = 'AlterExistUserTable1724741063814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`selfIntroduction\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`purpose\` varchar(128) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`target\` varchar(128) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`profileImageUrl\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`profileImageUrl\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`target\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`purpose\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`selfIntroduction\``);
    }

}
