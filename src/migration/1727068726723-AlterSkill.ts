import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterSkill1727068726723 implements MigrationInterface {
    name = 'AlterSkill1727068726723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`skill\` CHANGE \`id\` \`id\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`skill\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`skill\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`skill\` ADD \`id\` varchar(128) NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`skill\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`skill\` ADD \`id\` bigint NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`skill\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`skill\` CHANGE \`id\` \`id\` bigint NOT NULL AUTO_INCREMENT`);
    }

}
