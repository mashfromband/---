import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTable1728285868629 implements MigrationInterface {
    name = 'AddTable1728285868629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_skill_domain\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`clearCount\` int NOT NULL DEFAULT '0', \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`skillDomainId\` bigint NULL, UNIQUE INDEX \`IDX_4b491feee4f82bbd6bd3ea0ddc\` (\`userId\`, \`skillDomainId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_skill_domain\` ADD CONSTRAINT \`FK_540dd7f2c49ed67bff84e5c8ca3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_skill_domain\` ADD CONSTRAINT \`FK_b615face4482ac1a64840452e0e\` FOREIGN KEY (\`skillDomainId\`) REFERENCES \`skill_domain\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_skill_domain\` DROP FOREIGN KEY \`FK_b615face4482ac1a64840452e0e\``);
        await queryRunner.query(`ALTER TABLE \`user_skill_domain\` DROP FOREIGN KEY \`FK_540dd7f2c49ed67bff84e5c8ca3\``);
        await queryRunner.query(`DROP INDEX \`IDX_4b491feee4f82bbd6bd3ea0ddc\` ON \`user_skill_domain\``);
        await queryRunner.query(`DROP TABLE \`user_skill_domain\``);
    }

}
