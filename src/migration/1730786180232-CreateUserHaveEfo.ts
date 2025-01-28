import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserHaveEfo1730786180232 implements MigrationInterface {
    name = 'CreateUserHaveEfo1730786180232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_have_efo\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`haveEfo\` int NOT NULL DEFAULT '0', \`totalAddEfo\` int NOT NULL DEFAULT '0', \`totalConsumeEfo\` int NOT NULL DEFAULT '0', \`efoType\` enum ('questClear', 'free') NOT NULL, \`expireDate\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`IDX_38ba745cd9006a6d274e01987b\` (\`userId\`, \`efoType\`, \`expireDate\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_have_efo\` ADD CONSTRAINT \`FK_de74dee95f54027f9384c024460\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_have_efo\` DROP FOREIGN KEY \`FK_de74dee95f54027f9384c024460\``);
        await queryRunner.query(`DROP INDEX \`IDX_38ba745cd9006a6d274e01987b\` ON \`user_have_efo\``);
        await queryRunner.query(`DROP TABLE \`user_have_efo\``);
    }

}
