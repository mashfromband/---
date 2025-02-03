import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSnsTable1724744770460 implements MigrationInterface {
    name = 'CreateUserSnsTable1724744770460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sns\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_sns\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`snsId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_sns\` ADD CONSTRAINT \`FK_cb9792f56d22ebc394a6de5f883\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_sns\` ADD CONSTRAINT \`FK_d25bdbd4090a92f0fc682676e18\` FOREIGN KEY (\`snsId\`) REFERENCES \`sns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_sns\` DROP FOREIGN KEY \`FK_d25bdbd4090a92f0fc682676e18\``);
        await queryRunner.query(`ALTER TABLE \`user_sns\` DROP FOREIGN KEY \`FK_cb9792f56d22ebc394a6de5f883\``);
        await queryRunner.query(`DROP TABLE \`user_sns\``);
        await queryRunner.query(`DROP TABLE \`sns\``);
    }

}
