import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tags1751876489418 implements MigrationInterface {
  name = 'Tags1751876489418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Tags\` (\`id\` bigint NOT NULL, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`Tags\``);
  }
}
