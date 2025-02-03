import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableForHonor1733113829460 implements MigrationInterface {
    name = 'CreateTableForHonor1733113829460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`honor\` (\`id\` varchar(128) NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_honor\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`honorId\` varchar(128) NULL, UNIQUE INDEX \`IDX_66f57d3da74f0e1a1c63877cbb\` (\`userId\`, \`honorId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_honor\` ADD CONSTRAINT \`FK_b68f64297b64d29bf5cd775d577\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_honor\` ADD CONSTRAINT \`FK_9adf9a532c06b90ae6a72ece630\` FOREIGN KEY (\`honorId\`) REFERENCES \`honor\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_honor\` DROP FOREIGN KEY \`FK_9adf9a532c06b90ae6a72ece630\``);
        await queryRunner.query(`ALTER TABLE \`user_honor\` DROP FOREIGN KEY \`FK_b68f64297b64d29bf5cd775d577\``);
        await queryRunner.query(`DROP INDEX \`IDX_66f57d3da74f0e1a1c63877cbb\` ON \`user_honor\``);
        await queryRunner.query(`DROP TABLE \`user_honor\``);
        await queryRunner.query(`DROP TABLE \`honor\``);
    }

}
