import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1724743026167 implements MigrationInterface {
    name = 'CreateUserTables1724743026167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_private_profile\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NULL, \`nameCalling\` varchar(255) NULL, \`postalCode\` varchar(16) NULL, \`address\` varchar(255) NULL, \`phoneNumber\` varchar(16) NULL, \`sex\` enum ('male', 'female') NULL, \`rewardsAndPunishments\` varchar(255) NULL, \`picturePath\` varchar(128) NULL, \`contactPostalCode\` varchar(16) NULL, \`contactAddress\` varchar(255) NULL, \`contactPhoneNumber\` varchar(16) NULL, \`birthDay\` datetime NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, UNIQUE INDEX \`REL_e8a6400805afb6e9f776310bd5\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_private_educational_history\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`targetDate\` datetime NOT NULL, \`educationalHistoery\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_private_have_license\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`targetDate\` datetime NOT NULL, \`license\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_private_job_histroy\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`targetDate\` datetime NOT NULL, \`jobHistory\` varchar(255) NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` ADD CONSTRAINT \`FK_e8a6400805afb6e9f776310bd53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_private_educational_history\` ADD CONSTRAINT \`FK_b8e894401929f74e1935ca410e9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_private_have_license\` ADD CONSTRAINT \`FK_48f8ca4cf27539ce1ecd36b2ebb\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_private_job_histroy\` ADD CONSTRAINT \`FK_ebe4edcccc8f4ff054403f42476\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_private_job_histroy\` DROP FOREIGN KEY \`FK_ebe4edcccc8f4ff054403f42476\``);
        await queryRunner.query(`ALTER TABLE \`user_private_have_license\` DROP FOREIGN KEY \`FK_48f8ca4cf27539ce1ecd36b2ebb\``);
        await queryRunner.query(`ALTER TABLE \`user_private_educational_history\` DROP FOREIGN KEY \`FK_b8e894401929f74e1935ca410e9\``);
        await queryRunner.query(`ALTER TABLE \`user_private_profile\` DROP FOREIGN KEY \`FK_e8a6400805afb6e9f776310bd53\``);
        await queryRunner.query(`DROP TABLE \`user_private_job_histroy\``);
        await queryRunner.query(`DROP TABLE \`user_private_have_license\``);
        await queryRunner.query(`DROP TABLE \`user_private_educational_history\``);
        await queryRunner.query(`DROP INDEX \`REL_e8a6400805afb6e9f776310bd5\` ON \`user_private_profile\``);
        await queryRunner.query(`DROP TABLE \`user_private_profile\``);
    }

}
