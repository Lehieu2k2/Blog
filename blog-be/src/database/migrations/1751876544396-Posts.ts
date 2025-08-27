import { MigrationInterface, QueryRunner } from 'typeorm';

export class Posts1751876544396 implements MigrationInterface {
  name = 'Posts1751876544396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Posts\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`userId\` bigint NOT NULL, \`description\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`thumbnailId\` bigint NOT NULL, \`categoryId\` bigint NOT NULL, \`slug\` varchar(255) NOT NULL, \`status\` int NOT NULL, \`moderatorId\` bigint NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_3d9d25e422b686085dea293f52\` (\`thumbnailId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` ADD CONSTRAINT \`FK_a8237eded7a9a311081b65ed0b8\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` ADD CONSTRAINT \`FK_59dc0cf55e86117fd1869dc80be\` FOREIGN KEY (\`moderatorId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` ADD CONSTRAINT \`FK_3d9d25e422b686085dea293f52d\` FOREIGN KEY (\`thumbnailId\`) REFERENCES \`LocalFiles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` ADD CONSTRAINT \`FK_4e98e49f8dc9c258753bc389386\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Posts\` DROP FOREIGN KEY \`FK_4e98e49f8dc9c258753bc389386\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` DROP FOREIGN KEY \`FK_3d9d25e422b686085dea293f52d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` DROP FOREIGN KEY \`FK_59dc0cf55e86117fd1869dc80be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Posts\` DROP FOREIGN KEY \`FK_a8237eded7a9a311081b65ed0b8\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_3d9d25e422b686085dea293f52\` ON \`Posts\``,
    );
    await queryRunner.query(`DROP TABLE \`Posts\``);
  }
}
