import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1725955758471 implements MigrationInterface {
    name = 'AlterTable1725955758471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD \`prefectureCode\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP FOREIGN KEY \`FK_e6a5ee7de44e372125ce0f408c4\``);
        await queryRunner.query(`ALTER TABLE \`company_type\` CHANGE \`id\` \`id\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`company_type\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`company_type\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`company_type\` ADD \`id\` int NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP COLUMN \`companyTypeId\``);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD \`companyTypeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD CONSTRAINT \`FK_e6a5ee7de44e372125ce0f408c4\` FOREIGN KEY (\`companyTypeId\`) REFERENCES \`company_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP FOREIGN KEY \`FK_e6a5ee7de44e372125ce0f408c4\``);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP COLUMN \`companyTypeId\``);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD \`companyTypeId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`company_type\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`company_type\` ADD \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`company_type\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`company_type\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` ADD CONSTRAINT \`FK_e6a5ee7de44e372125ce0f408c4\` FOREIGN KEY (\`companyTypeId\`) REFERENCES \`company_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_info\` DROP COLUMN \`prefectureCode\``);
    }

}
