import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAddAddressFurigana1725601225190 implements MigrationInterface {
    name = 'AlterAddAddressFurigana1725601225190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD \`addressCalling\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD \`contactAddressCalling\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP COLUMN \`contactAddressCalling\``);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP COLUMN \`addressCalling\``);
    }

}
