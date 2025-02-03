import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserQuestHistory1727936929911 implements MigrationInterface {
    name = 'AddUserQuestHistory1727936929911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_quest_history\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`score\` datetime NOT NULL, \`isClear\` tinyint NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` bigint NULL, \`questId\` char(38) NULL, INDEX \`IDX_af0734e54505222da8168ddf48\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` ADD CONSTRAINT \`FK_d7d0916e7498fece99753695b83\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` ADD CONSTRAINT \`FK_d906e81d5d698f6143e212fbd3d\` FOREIGN KEY (\`questId\`) REFERENCES \`quest\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` DROP FOREIGN KEY \`FK_d906e81d5d698f6143e212fbd3d\``);
        await queryRunner.query(`ALTER TABLE \`user_quest_history\` DROP FOREIGN KEY \`FK_d7d0916e7498fece99753695b83\``);
        await queryRunner.query(`DROP INDEX \`IDX_af0734e54505222da8168ddf48\` ON \`user_quest_history\``);
        await queryRunner.query(`DROP TABLE \`user_quest_history\``);
    }

}
