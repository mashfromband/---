import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1730091634586 implements MigrationInterface {
    name = 'CreateTable1730091634586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`real_efo_rate\` (\`id\` int NOT NULL, \`oneRealToEfo\` int NOT NULL, \`isDefaultRate\` tinyint NOT NULL, \`periodBeginAt\` datetime NULL, \`periodEndAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_real_history\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(32) NOT NULL, \`addReal\` int NOT NULL DEFAULT '0', \`consumeReal\` int NOT NULL DEFAULT '0', \`type\` enum ('normal') NOT NULL DEFAULT 'normal', \`reason\` enum ('exchangeFromEfo', 'exchangeToDigico') NOT NULL, \`incomingTransactionId\` varchar(32) NULL, \`expireDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`adaptedExchangeRateId\` int NULL, UNIQUE INDEX \`IDX_72629dc7791caf191d61dd06b0\` (\`outgoingId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD CONSTRAINT \`FK_2edf7d37e64d9894a741a54c8be\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` ADD CONSTRAINT \`FK_dcf183985136522a08023d5ee07\` FOREIGN KEY (\`adaptedExchangeRateId\`) REFERENCES \`real_efo_rate\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP FOREIGN KEY \`FK_dcf183985136522a08023d5ee07\``);
        await queryRunner.query(`ALTER TABLE \`user_real_history\` DROP FOREIGN KEY \`FK_2edf7d37e64d9894a741a54c8be\``);
        await queryRunner.query(`DROP INDEX \`IDX_72629dc7791caf191d61dd06b0\` ON \`user_real_history\``);
        await queryRunner.query(`DROP TABLE \`user_real_history\``);
        await queryRunner.query(`DROP TABLE \`real_efo_rate\``);
    }

}
