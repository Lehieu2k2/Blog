import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comments1751876559199 implements MigrationInterface {
  name = 'Comments1751876559199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Comments\` (\`id\` bigint NOT NULL, \`content\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`website\` varchar(255) NOT NULL, \`isRobot\` tinyint NOT NULL, \`status\` int NOT NULL, \`postId\` bigint NOT NULL, \`parentId\` bigint NOT NULL, \`creatorId\` bigint NOT NULL, \`moderatorId\` bigint NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_7eb7c19357fe03099732cbe5be3\` FOREIGN KEY (\`creatorId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_ddebdb6eba4ca6984daa54c85ee\` FOREIGN KEY (\`moderatorId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_68844d71da70caf0f0f4b0ed72d\` FOREIGN KEY (\`postId\`) REFERENCES \`Posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` ADD CONSTRAINT \`FK_11e2470fb8467a2a49ac3de38aa\` FOREIGN KEY (\`parentId\`) REFERENCES \`Comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_11e2470fb8467a2a49ac3de38aa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_68844d71da70caf0f0f4b0ed72d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_ddebdb6eba4ca6984daa54c85ee\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Comments\` DROP FOREIGN KEY \`FK_7eb7c19357fe03099732cbe5be3\``,
    );
    await queryRunner.query(`DROP TABLE \`Comments\``);
  }
}
