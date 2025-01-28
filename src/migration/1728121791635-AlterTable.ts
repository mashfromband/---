import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1728121791635 implements MigrationInterface {
    name = 'AlterTable1728121791635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tag\` ADD \`outgoingId\` varchar(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tag\` ADD UNIQUE INDEX \`IDX_0c28d6af9d40de79fd968f39fd\` (\`outgoingId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tag\` DROP INDEX \`IDX_0c28d6af9d40de79fd968f39fd\``);
        await queryRunner.query(`ALTER TABLE \`tag\` DROP COLUMN \`outgoingId\``);
    }

}
