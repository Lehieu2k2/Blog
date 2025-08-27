import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostJoinTags1751876586458 implements MigrationInterface {
  name = 'PostJoinTags1751876586458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`PostJoinTags\` (\`id\` bigint NOT NULL, \`postId\` bigint NOT NULL, \`tagId\` bigint NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PostJoinTags\` ADD CONSTRAINT \`FK_5544cb7ed4d9075d2405cc3095b\` FOREIGN KEY (\`postId\`) REFERENCES \`Posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`PostJoinTags\` ADD CONSTRAINT \`FK_c49949d7d50f00a4e2e8b968147\` FOREIGN KEY (\`tagId\`) REFERENCES \`Tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`PostJoinTags\` DROP FOREIGN KEY \`FK_c49949d7d50f00a4e2e8b968147\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`PostJoinTags\` DROP FOREIGN KEY \`FK_5544cb7ed4d9075d2405cc3095b\``,
    );
    await queryRunner.query(`DROP TABLE \`PostJoinTags\``);
  }
}
