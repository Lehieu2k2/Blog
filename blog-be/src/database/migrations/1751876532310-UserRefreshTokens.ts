import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRefreshTokens1751876532310 implements MigrationInterface {
  name = 'UserRefreshTokens1751876532310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`UserRefreshTokens\` (\`id\` bigint NOT NULL, \`userId\` bigint NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`expiredAt\` timestamp NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserRefreshTokens\` ADD CONSTRAINT \`FK_671e46dabdabfdc57c587875d77\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`UserRefreshTokens\` DROP FOREIGN KEY \`FK_671e46dabdabfdc57c587875d77\``,
    );
    await queryRunner.query(`DROP TABLE \`UserRefreshTokens\``);
  }
}
