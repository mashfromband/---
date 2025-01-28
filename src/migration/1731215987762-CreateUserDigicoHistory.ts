import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserDigicoHistory1731215987762 implements MigrationInterface {
    name = 'CreateUserDigicoHistory1731215987762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_digico_history\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`digicoTradeId\` char(20) NOT NULL, \`digicoGiftIdentifyCode\` int NOT NULL, \`digicoAmount\` int NOT NULL DEFAULT '1', \`digicoRequestedAt\` datetime NOT NULL, \`digicoGiftCode\` varchar(32) NOT NULL, \`digicoGiftUrl\` varchar(255) NOT NULL, \`digicoExpireDate\` datetime NOT NULL, \`digicoManageCode\` char(20) NOT NULL, \`digicoSendTime\` datetime NOT NULL, \`consumeReal\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`IDX_5304da25ecfdf8383565e78f04\` (\`digicoTradeId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_digico_history\` ADD CONSTRAINT \`FK_bafcd27854572f9ea9fd0b7da35\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_digico_history\` DROP FOREIGN KEY \`FK_bafcd27854572f9ea9fd0b7da35\``);
        await queryRunner.query(`DROP INDEX \`IDX_5304da25ecfdf8383565e78f04\` ON \`user_digico_history\``);
        await queryRunner.query(`DROP TABLE \`user_digico_history\``);
    }

}
