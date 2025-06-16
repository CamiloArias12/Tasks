import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class SeedAdminUser1671234567893 implements MigrationInterface {
  name = 'SeedAdminUser1671234567893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingAdmin = await queryRunner.query(
      `SELECT * FROM "user" WHERE email = 'admin@example.com'`
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryRunner.query(`
      INSERT INTO "user" (id, name, email, hashed_password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE)
    `, [adminId, 'Admin User', 'admin@example.com', hashedPassword, 'ADMIN']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user" WHERE email = 'admin@example.com'`);
  }
}