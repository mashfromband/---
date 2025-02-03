import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1722321415249 implements MigrationInterface {
    name = 'CreateUser1722321415249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(64) NOT NULL, \`mailAddress\` varchar(255) NOT NULL, \`passwordHash\` varchar(128) NOT NULL, \`isValid\` tinyint NOT NULL DEFAULT 1, \`withdrawaledAt\` datetime NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_610587f7d834644b2dc35e48ec\` (\`outgoingId\`), UNIQUE INDEX \`IDX_189e2544c8516b3c64ef663bab\` (\`mailAddress\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_189e2544c8516b3c64ef663bab\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_610587f7d834644b2dc35e48ec\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
