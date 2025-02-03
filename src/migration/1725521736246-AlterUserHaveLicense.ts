import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserHaveLicense1725521736246 implements MigrationInterface {
    name = 'AlterUserHaveLicense1725521736246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_have_license\` ADD \`outgoingId\` varchar(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_private_have_license\` ADD UNIQUE INDEX \`IDX_1e13dcc8df740f4c44c39620ec\` (\`outgoingId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_have_license\` DROP INDEX \`IDX_1e13dcc8df740f4c44c39620ec\``);
        await queryRunner.query(`ALTER TABLE \`user_private_have_license\` DROP COLUMN \`outgoingId\``);
    }

}
