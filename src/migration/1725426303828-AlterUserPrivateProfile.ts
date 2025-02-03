import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserPrivateProfile1725426303828 implements MigrationInterface {
    name = 'AlterUserPrivateProfile1725426303828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD \`prefectureCode\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD \`contactPrefectureCode\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP COLUMN \`contactPrefectureCode\``);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP COLUMN \`prefectureCode\``);
    }

}
