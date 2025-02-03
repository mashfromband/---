import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserProfileTable1724818227167 implements MigrationInterface {
    name = 'AlterUserProfileTable1724818227167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`forOpen\` enum ('close', 'businessOnly', 'open') NOT NULL DEFAULT 'close'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`forOpen\``);
    }

}
