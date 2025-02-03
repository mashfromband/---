import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagTables1727245574134 implements MigrationInterface {
    name = 'AddTagTables1727245574134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mission_tag\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`missionId\` varchar(36) NULL, \`tagId\` bigint NULL, UNIQUE INDEX \`IDX_50c21d950c94361f57a4f54a55\` (\`missionId\`, \`tagId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`quest_tag\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`questId\` varchar(36) NULL, \`tagId\` bigint NULL, UNIQUE INDEX \`IDX_f1c4b029ce20f6bec83cc2f033\` (\`questId\`, \`tagId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category_tag\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`categoryId\` varchar(36) NULL, \`tagId\` bigint NULL, UNIQUE INDEX \`IDX_fa027a64cd787b2a96880bf48b\` (\`categoryId\`, \`tagId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`genre_tag\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`genreId\` varchar(36) NULL, \`tagId\` bigint NULL, UNIQUE INDEX \`IDX_58fca4f90f52942af17df70fb8\` (\`genreId\`, \`tagId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(128) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_6a9775008add570dc3e5a0bab7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`mission_tag\` ADD CONSTRAINT \`FK_16f7de6be36936b3269ef656e2f\` FOREIGN KEY (\`missionId\`) REFERENCES \`mission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mission_tag\` ADD CONSTRAINT \`FK_1d36c89c3a86aaeba1352590b05\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quest_tag\` ADD CONSTRAINT \`FK_8c65a59af970cec2644521b2f7e\` FOREIGN KEY (\`questId\`) REFERENCES \`quest\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`quest_tag\` ADD CONSTRAINT \`FK_2031611627f77182bd5281471a1\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_tag\` ADD CONSTRAINT \`FK_4c2621b90d12c22fba97f1e4686\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_tag\` ADD CONSTRAINT \`FK_1f39cbacf12f307594f6e4ac14b\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`genre_tag\` ADD CONSTRAINT \`FK_500d84b2eaa076f2728449f0102\` FOREIGN KEY (\`genreId\`) REFERENCES \`genre\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`genre_tag\` ADD CONSTRAINT \`FK_4dec2d27d6e4ee6c55617ca568d\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`genre_tag\` DROP FOREIGN KEY \`FK_4dec2d27d6e4ee6c55617ca568d\``);
        await queryRunner.query(`ALTER TABLE \`genre_tag\` DROP FOREIGN KEY \`FK_500d84b2eaa076f2728449f0102\``);
        await queryRunner.query(`ALTER TABLE \`category_tag\` DROP FOREIGN KEY \`FK_1f39cbacf12f307594f6e4ac14b\``);
        await queryRunner.query(`ALTER TABLE \`category_tag\` DROP FOREIGN KEY \`FK_4c2621b90d12c22fba97f1e4686\``);
        await queryRunner.query(`ALTER TABLE \`quest_tag\` DROP FOREIGN KEY \`FK_2031611627f77182bd5281471a1\``);
        await queryRunner.query(`ALTER TABLE \`quest_tag\` DROP FOREIGN KEY \`FK_8c65a59af970cec2644521b2f7e\``);
        await queryRunner.query(`ALTER TABLE \`mission_tag\` DROP FOREIGN KEY \`FK_1d36c89c3a86aaeba1352590b05\``);
        await queryRunner.query(`ALTER TABLE \`mission_tag\` DROP FOREIGN KEY \`FK_16f7de6be36936b3269ef656e2f\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a9775008add570dc3e5a0bab7\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_58fca4f90f52942af17df70fb8\` ON \`genre_tag\``);
        await queryRunner.query(`DROP TABLE \`genre_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_fa027a64cd787b2a96880bf48b\` ON \`category_tag\``);
        await queryRunner.query(`DROP TABLE \`category_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_f1c4b029ce20f6bec83cc2f033\` ON \`quest_tag\``);
        await queryRunner.query(`DROP TABLE \`quest_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_50c21d950c94361f57a4f54a55\` ON \`mission_tag\``);
        await queryRunner.query(`DROP TABLE \`mission_tag\``);
    }

}
