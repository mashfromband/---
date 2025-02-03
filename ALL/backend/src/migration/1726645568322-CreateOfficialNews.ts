import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOfficialNews1726645568322 implements MigrationInterface {
    name = 'CreateOfficialNews1726645568322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`official_news\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`outgoingId\` varchar(64) NOT NULL, \`title\` varchar(255) NOT NULL, \`detail\` text NOT NULL, \`priority\` int NOT NULL DEFAULT '10', \`beginPeriodAt\` datetime NOT NULL, \`endPeriodAt\` datetime NOT NULL, \`createdaAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_ddc4a909fc9aa2ef3ab429e8f8\` (\`priority\`, \`beginPeriodAt\`, \`endPeriodAt\`), UNIQUE INDEX \`IDX_3ee40eb3f256ab407c1430a4e6\` (\`outgoingId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3ee40eb3f256ab407c1430a4e6\` ON \`official_news\``);
        await queryRunner.query(`DROP INDEX \`IDX_ddc4a909fc9aa2ef3ab429e8f8\` ON \`official_news\``);
        await queryRunner.query(`DROP TABLE \`official_news\``);
    }

}
