import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterHonor1735025072833 implements MigrationInterface {
    name = 'AlterHonor1735025072833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`honor\` ADD \`detail\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`honor\` DROP COLUMN \`detail\``);
    }

}
