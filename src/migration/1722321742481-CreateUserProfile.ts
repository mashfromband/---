import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProfile1722321742481 implements MigrationInterface {
    name = 'CreateUserProfile1722321742481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_profile\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`nickname\` varchar(128) NOT NULL, \`withdrawaledAt\` datetime NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`IDX_d18bf885831f4ed38f069fefcb\` (\`nickname\`), UNIQUE INDEX \`REL_51cb79b5555effaf7d69ba1cff\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD CONSTRAINT \`FK_51cb79b5555effaf7d69ba1cff9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP FOREIGN KEY \`FK_51cb79b5555effaf7d69ba1cff9\``);
        await queryRunner.query(`DROP INDEX \`REL_51cb79b5555effaf7d69ba1cff\` ON \`user_profile\``);
        await queryRunner.query(`DROP INDEX \`IDX_d18bf885831f4ed38f069fefcb\` ON \`user_profile\``);
        await queryRunner.query(`DROP TABLE \`user_profile\``);
    }

}
