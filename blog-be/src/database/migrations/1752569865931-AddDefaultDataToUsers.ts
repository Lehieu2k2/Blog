import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultDataToUsers1752569865931 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO \`Users\` (
            \`id\`, 
            \`account\`, 
            \`password\`, 
            \`fullName\`, 
            \`phoneNumber\`, 
            \`email\`, 
            \`dateOfBirth\`, 
            \`gender\`, 
            \`isVerified\`, 
            \`status\`,
            \`role\`
        ) VALUES
        (
            488265709499977728, 
            'Admin', 
            '$2b$10$p8NXa5qYPqskpvgCUyAkE.H3HnMpFeqBjPIorfNBxLvGYfrfBE83.', 
            'Admin', 
            '0977877888', 
            'Admin@gmail.com', 
            '2002-11-17 00:00:00', 
            1, 
            true, 
            1,
            'ADMIN'
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM \`Users\` WHERE \`account\` = 'Admin';`,
    );
  }
}
