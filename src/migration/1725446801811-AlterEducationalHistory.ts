import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterEducationalHistory1725446801811 implements MigrationInterface {
    name = 'AlterEducationalHistory1725446801811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_educational_history\` ADD \`outgoingId\` varchar(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_private_educational_history\` ADD UNIQUE INDEX \`IDX_8277dbe027baa1cfdda1765dbe\` (\`outgoingId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_educational_history\` DROP INDEX \`IDX_8277dbe027baa1cfdda1765dbe\``);
        await queryRunner.query(`ALTER TABLE \`user_private_educational_history\` DROP COLUMN \`outgoingId\``);
    }

}
