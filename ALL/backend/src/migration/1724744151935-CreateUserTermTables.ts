import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTermTables1724744151935 implements MigrationInterface {
    name = 'CreateUserTermTables1724744151935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`term\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`termName\` varchar(255) NOT NULL, \`currentVersion\` int NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_agreement_term\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`agreedAt\` datetime NOT NULL, \`agreedVersion\` int NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`termId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_agreement_term\` ADD CONSTRAINT \`FK_30f98c6b16bc8ceabd6f22ad0f9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_agreement_term\` ADD CONSTRAINT \`FK_40bd7376d9e569bdb5bd048f274\` FOREIGN KEY (\`termId\`) REFERENCES \`term\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_agreement_term\` DROP FOREIGN KEY \`FK_40bd7376d9e569bdb5bd048f274\``);
        await queryRunner.query(`ALTER TABLE \`user_agreement_term\` DROP FOREIGN KEY \`FK_30f98c6b16bc8ceabd6f22ad0f9\``);
        await queryRunner.query(`DROP TABLE \`user_agreement_term\``);
        await queryRunner.query(`DROP TABLE \`term\``);
    }

}
