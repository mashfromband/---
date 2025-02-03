import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserRefreshToken1722321937711 implements MigrationInterface {
    name = 'CreateUserRefreshToken1722321937711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_refresh_token\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`expireAt\` datetime NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`IDX_cca1dbcca742456cf24913a0ab\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` ADD CONSTRAINT \`FK_9e2418637bd2ee8d14c7ccb1e34\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_refresh_token\` DROP FOREIGN KEY \`FK_9e2418637bd2ee8d14c7ccb1e34\``);
        await queryRunner.query(`DROP INDEX \`IDX_cca1dbcca742456cf24913a0ab\` ON \`user_refresh_token\``);
        await queryRunner.query(`DROP TABLE \`user_refresh_token\``);
    }

}
