import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueIndex1726550134091 implements MigrationInterface {
    name = 'RemoveUniqueIndex1726550134091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b6d73ec0590a87aeec621ce9d9\` ON \`recruit_company_info\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b6d73ec0590a87aeec621ce9d9\` ON \`recruit_company_info\` (\`displayName\`)`);
    }

}
