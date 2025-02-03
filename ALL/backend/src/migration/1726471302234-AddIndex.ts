import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndex1726471302234 implements MigrationInterface {
    name = 'AddIndex1726471302234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_ade46a785e140708023aad24ec\` ON \`recruit_company_wanted_ads\` (\`updatedAt\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ade46a785e140708023aad24ec\` ON \`recruit_company_wanted_ads\``);
    }

}
