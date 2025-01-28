import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserHaveReal1730790659930 implements MigrationInterface {
    name = 'CreateUserHaveReal1730790659930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_have_real\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`haveReal\` int NOT NULL DEFAULT '0', \`totalAddReal\` int NOT NULL DEFAULT '0', \`totalConsumeReal\` int NOT NULL DEFAULT '0', \`realType\` enum ('normal') NOT NULL DEFAULT 'normal', \`incomingTransactionId\` varchar(32) NULL, \`expireDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`IDX_4911a139a8c1e670cb7fde02ac\` (\`userId\`, \`realType\`, \`expireDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_have_real\` ADD CONSTRAINT \`FK_cc5b37657e2ebfe95f7c002b208\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_have_real\` DROP FOREIGN KEY \`FK_cc5b37657e2ebfe95f7c002b208\``);
        await queryRunner.query(`DROP INDEX \`IDX_4911a139a8c1e670cb7fde02ac\` ON \`user_have_real\``);
        await queryRunner.query(`DROP TABLE \`user_have_real\``);
    }

}
