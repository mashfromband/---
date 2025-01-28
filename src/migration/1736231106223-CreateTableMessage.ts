import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableMessage1736231106223 implements MigrationInterface {
    name = 'CreateTableMessage1736231106223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message_room\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(64) NOT NULL, \`ownerUserId\` bigint NOT NULL, \`ownerUserType\` enum ('normal', 'recruitCompany') NOT NULL DEFAULT 'normal', \`ownerRecruitCompanyId\` bigint NULL, \`ownerUserLastPostId\` bigint NOT NULL, \`ownerUserIsClose\` tinyint NOT NULL, \`invitedUserId\` bigint NOT NULL, \`invitedUserType\` enum ('normal', 'recruitCompany') NOT NULL DEFAULT 'normal', \`invitedRecruitCompanyId\` bigint NULL, \`invitedUserLastPostId\` bigint NOT NULL, \`invitedUserIsClose\` tinyint NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_81d705f46fb84643b2c0918965\` (\`outgoingId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message_room_post\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(64) NOT NULL, \`postBody\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`messageRoomId\` bigint NULL, \`postUserId\` bigint NULL, UNIQUE INDEX \`IDX_ec4caf5f3d9a09d1a709779dc6\` (\`outgoingId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`message_room_post\` ADD CONSTRAINT \`FK_37aad3b54b0ad5c0ca120be37d4\` FOREIGN KEY (\`messageRoomId\`) REFERENCES \`message_room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message_room_post\` ADD CONSTRAINT \`FK_c50931a3bbc86fc778763e679e2\` FOREIGN KEY (\`postUserId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message_room_post\` DROP FOREIGN KEY \`FK_c50931a3bbc86fc778763e679e2\``);
        await queryRunner.query(`ALTER TABLE \`message_room_post\` DROP FOREIGN KEY \`FK_37aad3b54b0ad5c0ca120be37d4\``);
        await queryRunner.query(`DROP INDEX \`IDX_ec4caf5f3d9a09d1a709779dc6\` ON \`message_room_post\``);
        await queryRunner.query(`DROP TABLE \`message_room_post\``);
        await queryRunner.query(`DROP INDEX \`IDX_81d705f46fb84643b2c0918965\` ON \`message_room\``);
        await queryRunner.query(`DROP TABLE \`message_room\``);
    }

}
