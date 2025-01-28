import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1730014314001 implements MigrationInterface {
    name = 'CreateTable1730014314001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_efo_history\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`addEfo\` int NOT NULL DEFAULT '0', \`consumeEfo\` int NOT NULL DEFAULT '0', \`type\` enum ('free') NOT NULL, \`reason\` enum ('questClear', 'exchangeReal') NOT NULL, \`transactionId\` varchar(32) NOT NULL, \`expireDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`IDX_2c5f9c6de257733fb8e62d9587\` (\`transactionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` ADD CONSTRAINT \`FK_0a422357a96b235b8c75b9cb8f8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_efo_history\` DROP FOREIGN KEY \`FK_0a422357a96b235b8c75b9cb8f8\``);
        await queryRunner.query(`DROP INDEX \`IDX_2c5f9c6de257733fb8e62d9587\` ON \`user_efo_history\``);
        await queryRunner.query(`DROP TABLE \`user_efo_history\``);
    }

}
