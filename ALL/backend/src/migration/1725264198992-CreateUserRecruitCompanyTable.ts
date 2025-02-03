import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserRecruitCompanyTable1725264198992 implements MigrationInterface {
    name = 'CreateUserRecruitCompanyTable1725264198992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_recruit_company\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`recruteCompanyId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_recruit_company\` ADD CONSTRAINT \`FK_1cb764a9a5cbc5e1187084a799c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_recruit_company\` ADD CONSTRAINT \`FK_775cece3edcedede1c5d844f0de\` FOREIGN KEY (\`recruteCompanyId\`) REFERENCES \`recruit_company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_recruit_company\` DROP FOREIGN KEY \`FK_775cece3edcedede1c5d844f0de\``);
        await queryRunner.query(`ALTER TABLE \`user_recruit_company\` DROP FOREIGN KEY \`FK_1cb764a9a5cbc5e1187084a799c\``);
        await queryRunner.query(`DROP TABLE \`user_recruit_company\``);
    }

}
