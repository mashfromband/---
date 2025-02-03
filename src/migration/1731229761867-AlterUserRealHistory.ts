import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserRealHistory1731229761867 implements MigrationInterface {
    name = 'AlterUserRealHistory1731229761867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD \`digicoTradeId\` char(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD UNIQUE INDEX \`IDX_abde9dccfaac300f3c60ff3949\` (\`digicoTradeId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP INDEX \`IDX_abde9dccfaac300f3c60ff3949\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP COLUMN \`digicoTradeId\``);
    }

}
