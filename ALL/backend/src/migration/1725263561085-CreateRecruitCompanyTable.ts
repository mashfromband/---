import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecruitCompanyTable1725263561085 implements MigrationInterface {
    name = 'CreateRecruitCompanyTable1725263561085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`company_type\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recruit_company_info\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`displayName\` varchar(255) NOT NULL, \`establishmentDate\` datetime NOT NULL, \`postalCode\` varchar(16) NOT NULL, \`address\` varchar(255) NOT NULL, \`phoneNumber\` varchar(16) NULL, \`faxNumber\` varchar(16) NULL, \`officialSiteUrl\` varchar(255) NOT NULL, \`profile\` text NOT NULL, \`employees\` varchar(64) NOT NULL, \`netSales\` varchar(64) NOT NULL, \`contactPersonName\` varchar(64) NOT NULL, \`contactPersonPosition\` varchar(64) NOT NULL, \`contactPersonPhoneNumber\` varchar(16) NOT NULL, \`contactPersionMailAddress\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`recruitCompanyId\` bigint NULL, \`companyTypeId\` bigint NULL, UNIQUE INDEX \`IDX_b6d73ec0590a87aeec621ce9d9\` (\`displayName\`), UNIQUE INDEX \`REL_1cafdecf8268d1e144f21382fe\` (\`recruitCompanyId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recruit_company\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(64) NOT NULL, \`name\` varchar(255) NOT NULL, \`beginPeriodAt\` datetime NOT NULL, \`endPeriodAt\` datetime NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_b5257b5a30b193449792581188\` (\`outgoingId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD CONSTRAINT \`FK_1cafdecf8268d1e144f21382fe3\` FOREIGN KEY (\`recruitCompanyId\`) REFERENCES \`recruit_company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD CONSTRAINT \`FK_e6a5ee7de44e372125ce0f408c4\` FOREIGN KEY (\`companyTypeId\`) REFERENCES \`company_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP FOREIGN KEY \`FK_e6a5ee7de44e372125ce0f408c4\``);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP FOREIGN KEY \`FK_1cafdecf8268d1e144f21382fe3\``);
        await queryRunner.query(`DROP INDEX \`IDX_b5257b5a30b193449792581188\` ON \`recruit_company\``);
        await queryRunner.query(`DROP TABLE \`recruit_company\``);
        await queryRunner.query(`DROP INDEX \`REL_1cafdecf8268d1e144f21382fe\` ON \`recruit_company_info\``);
        await queryRunner.query(`DROP INDEX \`IDX_b6d73ec0590a87aeec621ce9d9\` ON \`recruit_company_info\``);
        await queryRunner.query(`DROP TABLE \`recruit_company_info\``);
        await queryRunner.query(`DROP TABLE \`company_type\``);
    }

}
