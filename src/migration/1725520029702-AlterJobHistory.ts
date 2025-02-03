import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterJobHistory1725520029702 implements MigrationInterface {
    name = 'AlterJobHistory1725520029702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_job_histroy\` ADD \`outgoingId\` varchar(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_private_job_histroy\` ADD UNIQUE INDEX \`IDX_de9fe49e9cb57d836bed5249e8\` (\`outgoingId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_job_histroy\` DROP INDEX \`IDX_de9fe49e9cb57d836bed5249e8\``);
        await queryRunner.query(`ALTER TABLE \`user_private_job_histroy\` DROP COLUMN \`outgoingId\``);
    }

}
