import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndex1727165967771 implements MigrationInterface {
    name = 'AddUniqueIndex1727165967771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_992f9fd26eea80786798703154\` ON \`category_quest\` (\`categoryId\`, \`questId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_992f9fd26eea80786798703154\` ON \`category_quest\``);
    }

}
