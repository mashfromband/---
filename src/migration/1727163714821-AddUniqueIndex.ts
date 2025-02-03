import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueIndex1727163714821 implements MigrationInterface {
    name = 'AddUniqueIndex1727163714821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c2e8ad82d166e5eb29cc964ffa\` ON \`genre_category\` (\`genreId\`, \`categoryId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_c2e8ad82d166e5eb29cc964ffa\` ON \`genre_category\``);
    }

}
