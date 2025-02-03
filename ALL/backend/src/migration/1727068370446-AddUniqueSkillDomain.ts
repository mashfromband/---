import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueSkillDomain1727068370446 implements MigrationInterface {
    name = 'AddUniqueSkillDomain1727068370446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`skill_domain\` ADD UNIQUE INDEX \`IDX_5979e8569b3edc17cdb1781bc6\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`skill_domain\` DROP INDEX \`IDX_5979e8569b3edc17cdb1781bc6\``);
    }

}
