import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1727342381431 implements MigrationInterface {
    name = 'AlterTable1727342381431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` CHANGE \`profileImageUrl\` \`userIconId\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`userIconId\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`userIconId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD CONSTRAINT \`FK_532578bc7bd3159ee5774948ed9\` FOREIGN KEY (\`userIconId\`) REFERENCES \`user_icon\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP FOREIGN KEY \`FK_532578bc7bd3159ee5774948ed9\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP COLUMN \`userIconId\``);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD \`userIconId\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` CHANGE \`userIconId\` \`profileImageUrl\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
