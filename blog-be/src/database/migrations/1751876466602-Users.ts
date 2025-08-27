import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1751876466602 implements MigrationInterface {
  name = 'Users1751876466602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`account\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`dateOfBirth\` timestamp NULL, \`gender\` int NULL, \`fullName\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NULL, \`status\` int NOT NULL, \`isVerified\` boolean NOT NULL DEFAULT false, \`role\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3c3ab3f49a87e6ddb607f3c494\` ON \`Users\``,
    );
    await queryRunner.query(`DROP TABLE \`Users\``);
  }
}
