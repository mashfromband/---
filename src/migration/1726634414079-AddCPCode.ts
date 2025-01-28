import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCPCode1726634414079 implements MigrationInterface {
    name = 'AddCPCode1726634414079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`recruit_company_code\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`companyCode\` varchar(16) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`recruitCompanyId\` bigint NULL, UNIQUE INDEX \`IDX_cde32d5ab402b4a2970c31d152\` (\`companyCode\`), UNIQUE INDEX \`REL_00215d82433935b8ae8b366723\` (\`recruitCompanyId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`recruit_company_code\` ADD CONSTRAINT \`FK_00215d82433935b8ae8b3667237\` FOREIGN KEY (\`recruitCompanyId\`) REFERENCES \`recruit_company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recruit_company_code\` DROP FOREIGN KEY \`FK_00215d82433935b8ae8b3667237\``);
        await queryRunner.query(`DROP INDEX \`REL_00215d82433935b8ae8b366723\` ON \`recruit_company_code\``);
        await queryRunner.query(`DROP INDEX \`IDX_cde32d5ab402b4a2970c31d152\` ON \`recruit_company_code\``);
        await queryRunner.query(`DROP TABLE \`recruit_company_code\``);
    }

}
