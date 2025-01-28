import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserHonor1735017548993 implements MigrationInterface {
    name = 'AlterUserHonor1735017548993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_honor\` ADD \`isSet\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_honor\` DROP COLUMN \`isSet\``);
    }

}
