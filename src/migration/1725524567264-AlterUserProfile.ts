import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserProfile1725524567264 implements MigrationInterface {
    name = 'AlterUserProfile1725524567264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`target\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`skillAndKnowledge\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`purpose\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`purpose\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`purpose\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`purpose\` varchar(128) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`skillAndKnowledge\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`target\` varchar(128) NOT NULL DEFAULT ''`);
    }

}
