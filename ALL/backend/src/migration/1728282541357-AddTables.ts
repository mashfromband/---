import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1728282541357 implements MigrationInterface {
    name = 'AddTables1728282541357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_skill\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`level\` int NOT NULL DEFAULT '1', \`exp\` int NOT NULL DEFAULT '0', \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`skillId\` varchar(128) NULL, UNIQUE INDEX \`IDX_ad35af7f2b556d0b9a67af8db8\` (\`userId\`, \`skillId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_skill\` ADD CONSTRAINT \`FK_03260daf2df95f4492cc8eb00e6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_skill\` ADD CONSTRAINT \`FK_49db81d31fc330a905af3c01205\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_skill\` DROP FOREIGN KEY \`FK_49db81d31fc330a905af3c01205\``);
        await queryRunner.query(`ALTER TABLE \`user_skill\` DROP FOREIGN KEY \`FK_03260daf2df95f4492cc8eb00e6\``);
        await queryRunner.query(`DROP INDEX \`IDX_ad35af7f2b556d0b9a67af8db8\` ON \`user_skill\``);
        await queryRunner.query(`DROP TABLE \`user_skill\``);
    }

}
