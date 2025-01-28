import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTable1728281452375 implements MigrationInterface {
    name = 'AddTable1728281452375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_results\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`level\` int NOT NULL DEFAULT '1', \`exp\` int NOT NULL DEFAULT '0', \`clearQuestCount\` int NOT NULL DEFAULT '0', \`totalScore\` int NOT NULL DEFAULT '0', \`point\` int NOT NULL DEFAULT '0', \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`REL_3284030438a9ab002daeb9dd78\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_results\` ADD CONSTRAINT \`FK_3284030438a9ab002daeb9dd78b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_results\` DROP FOREIGN KEY \`FK_3284030438a9ab002daeb9dd78b\``);
        await queryRunner.query(`DROP INDEX \`REL_3284030438a9ab002daeb9dd78\` ON \`user_results\``);
        await queryRunner.query(`DROP TABLE \`user_results\``);
    }

}
