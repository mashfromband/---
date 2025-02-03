import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1727596365318 implements MigrationInterface {
    name = 'AddIndex1727596365318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_8c4bf3ff31e733b70c68487f90\` ON \`recruit_company\` (\`beginPeriodAt\`, \`endPeriodAt\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_8c4bf3ff31e733b70c68487f90\` ON \`recruit_company\``);
    }

}
