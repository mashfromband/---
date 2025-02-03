import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1736924746627 implements MigrationInterface {
    name = 'AlterTable1736924746627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message_room\` ADD \`applyJobStatus\` enum ('applyJobFromUser', 'offerFromRecruitCompany', 'beforeDocumentScreening', 'documentScreening', 'beforeInterview', 'afterInterview', 'employment', 'rejection', 'cancel', 'unknown') NULL`);
        await queryRunner.query(`ALTER TABLE \`message_room\` ADD \`recruitCompanyWantedAdsId\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message_room\` DROP COLUMN \`recruitCompanyWantedAdsId\``);
        await queryRunner.query(`ALTER TABLE \`message_room\` DROP COLUMN \`applyJobStatus\``);
    }

}
