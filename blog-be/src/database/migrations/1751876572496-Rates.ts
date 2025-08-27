import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rates1751876572496 implements MigrationInterface {
  name = 'Rates1751876572496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Rates\` (\`id\` bigint NOT NULL, \`postId\` bigint NOT NULL, \`ip\` varchar(255) NOT NULL, \`star\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Rates\` ADD CONSTRAINT \`FK_9cb8b208e5a0f4f56eaf39d3b3e\` FOREIGN KEY (\`postId\`) REFERENCES \`Posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Rates\` DROP FOREIGN KEY \`FK_9cb8b208e5a0f4f56eaf39d3b3e\``,
    );
    await queryRunner.query(`DROP TABLE \`Rates\``);
  }
}
