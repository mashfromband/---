import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAddAppealPointAndWishes1725603509230 implements MigrationInterface {
    name = 'AlterAddAppealPointAndWishes1725603509230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD \`appealPoint\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD \`wishes\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP COLUMN \`wishes\``);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP COLUMN \`appealPoint\``);
    }

}
