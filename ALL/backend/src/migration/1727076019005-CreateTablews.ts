import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablews1727076019005 implements MigrationInterface {
    name = 'CreateTablews1727076019005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`genre\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(128) NOT NULL, \`detail\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`genre_category\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`genreId\` varchar(36) NULL, \`categoryId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(128) NOT NULL, \`detail\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_quest\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`categoryId\` varchar(36) NULL, \`questId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mission\` (\`id\` varchar(36) NOT NULL, \`index\` int NOT NULL, \`name\` varchar(128) NOT NULL, \`questionPath\` varchar(255) NOT NULL, \`optionPath\` varchar(255) NOT NULL, \`correctCommentaryPath\` varchar(255) NOT NULL, \`wrongCommentaryPath\` varchar(255) NOT NULL, \`score\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`questId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quest\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(128) NOT NULL, \`detail\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`genre_category\` ADD CONSTRAINT \`FK_9e52611cbb39d120b0d7bf57396\` FOREIGN KEY (\`genreId\`) REFERENCES \`genre\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`genre_category\` ADD CONSTRAINT \`FK_b885d3161ab1cc5b76e89a8a33d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_quest\` ADD CONSTRAINT \`FK_9cd3dfaa3e2a948c64677e2e7c5\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_quest\` ADD CONSTRAINT \`FK_b39a629aaa45b77eab51e814e91\` FOREIGN KEY (\`questId\`) REFERENCES \`quest\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mission\` ADD CONSTRAINT \`FK_dec57138c9e28d54eac422ba1c6\` FOREIGN KEY (\`questId\`) REFERENCES \`quest\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mission\` DROP FOREIGN KEY \`FK_dec57138c9e28d54eac422ba1c6\``);
        await queryRunner.query(`ALTER TABLE \`category_quest\` DROP FOREIGN KEY \`FK_b39a629aaa45b77eab51e814e91\``);
        await queryRunner.query(`ALTER TABLE \`category_quest\` DROP FOREIGN KEY \`FK_9cd3dfaa3e2a948c64677e2e7c5\``);
        await queryRunner.query(`ALTER TABLE \`genre_category\` DROP FOREIGN KEY \`FK_b885d3161ab1cc5b76e89a8a33d\``);
        await queryRunner.query(`ALTER TABLE \`genre_category\` DROP FOREIGN KEY \`FK_9e52611cbb39d120b0d7bf57396\``);
        await queryRunner.query(`DROP TABLE \`quest\``);
        await queryRunner.query(`DROP TABLE \`mission\``);
        await queryRunner.query(`DROP TABLE \`category_quest\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`genre_category\``);
        await queryRunner.query(`DROP TABLE \`genre\``);
    }

}
