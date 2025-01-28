import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1726033707685 implements MigrationInterface {
    name = 'CreateTable1726033707685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`recruit_company_wanted_ads\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(64) NOT NULL, \`title\` varchar(128) NOT NULL, \`position\` varchar(64) NOT NULL, \`workLocation\` varchar(64) NOT NULL, \`employmentStatus\` varchar(64) NOT NULL, \`numberOfPeople\` varchar(32) NOT NULL, \`details\` text NOT NULL, \`requirements\` varchar(255) NOT NULL, \`salaryAndBenefits\` varchar(255) NOT NULL, \`officeHour\` varchar(128) NOT NULL, \`dayOff\` varchar(128) NOT NULL, \`welfareProgram\` varchar(255) NOT NULL, \`howToApply\` varchar(128) NOT NULL, \`applicationDocuments\` varchar(255) NOT NULL, \`applicationDeadline\` datetime NOT NULL, \`beginAt\` datetime NOT NULL, \`endAt\` datetime NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`recruteCompanyId\` bigint NULL, INDEX \`IDX_3d98757783400bd1f101daae83\` (\`beginAt\`, \`endAt\`), UNIQUE INDEX \`IDX_80e4f21ef515ecc623237691bc\` (\`outgoingId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_wanted_ads\` ADD CONSTRAINT \`FK_6a9e866d380f125df174ea760f2\` FOREIGN KEY (\`recruteCompanyId\`) REFERENCES \`recruit_company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recruit_company_wanted_ads\` DROP FOREIGN KEY \`FK_6a9e866d380f125df174ea760f2\``);
        await queryRunner.query(`DROP INDEX \`IDX_80e4f21ef515ecc623237691bc\` ON \`recruit_company_wanted_ads\``);
        await queryRunner.query(`DROP INDEX \`IDX_3d98757783400bd1f101daae83\` ON \`recruit_company_wanted_ads\``);
        await queryRunner.query(`DROP TABLE \`recruit_company_wanted_ads\``);
    }

}
