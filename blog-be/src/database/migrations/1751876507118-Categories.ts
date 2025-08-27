import { MigrationInterface, QueryRunner } from 'typeorm';

export class Categories1751876507118 implements MigrationInterface {
  name = 'Categories1751876507118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Categories\` (\`id\` bigint NOT NULL, \`parentId\` bigint NULL, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Categories\` ADD CONSTRAINT \`FK_1eabf8acaf25797323ad4cecc9d\` FOREIGN KEY (\`parentId\`) REFERENCES \`Categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Categories\` DROP FOREIGN KEY \`FK_1eabf8acaf25797323ad4cecc9d\``,
    );
    await queryRunner.query(`DROP TABLE \`Categories\``);
  }
}
