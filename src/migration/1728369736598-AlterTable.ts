import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1728369736598 implements MigrationInterface {
    name = 'AlterTable1728369736598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quest\` ADD \`skillDomainId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`quest\` ADD CONSTRAINT \`FK_dd0d6a4562da9ffacd5964c7a21\` FOREIGN KEY (\`skillDomainId\`) REFERENCES \`skill_domain\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quest\` DROP FOREIGN KEY \`FK_dd0d6a4562da9ffacd5964c7a21\``);
        await queryRunner.query(`ALTER TABLE \`quest\` DROP COLUMN \`skillDomainId\``);
    }

}
