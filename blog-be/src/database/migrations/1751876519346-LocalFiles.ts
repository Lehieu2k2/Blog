import { MigrationInterface, QueryRunner } from "typeorm";

export class LocalFiles1751876519346 implements MigrationInterface {
    name = 'LocalFiles1751876519346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`LocalFiles\` (\`id\` bigint NOT NULL, \`userId\` bigint NOT NULL, \`filename\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`pathConvert\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`LocalFiles\` ADD CONSTRAINT \`FK_15486f7d0d2a50c266a9ac7ed05\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`LocalFiles\` DROP FOREIGN KEY \`FK_15486f7d0d2a50c266a9ac7ed05\``);
        await queryRunner.query(`DROP TABLE \`LocalFiles\``);
    }
}
