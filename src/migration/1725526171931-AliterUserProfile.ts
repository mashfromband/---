import { MigrationInterface, QueryRunner } from "typeorm";

export class AliterUserProfile1725526171931 implements MigrationInterface {
    name = 'AliterUserProfile1725526171931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`skillAndKnowledge\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`targetSkill\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`targetKnowledge\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`targetKnowledge\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`targetSkill\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`skillAndKnowledge\` text NOT NULL`);
    }

}
