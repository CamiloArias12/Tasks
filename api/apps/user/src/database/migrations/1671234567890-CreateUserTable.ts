import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserTable1671234567890 implements MigrationInterface {
  name = 'CreateUserTable1671234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the enum type first
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('user', 'admin')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'hashed_password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['user', 'admin'],
            default: "'user'",
          },
          {
            name: 'created_at',
            type: 'date',
            default: 'CURRENT_DATE',
          },
          {
            name: 'updated_at',
            type: 'date',
            default: 'CURRENT_DATE',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: 'IDX_USER_EMAIL',
            columnNames: ['email'],
            isUnique: true,
          },
        ],
      }),
      true,
    );

    // Seed admin user after creating the table
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryRunner.query(
      `
      INSERT INTO "user" (id, name, email, hashed_password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE)
    `,
      [adminId, 'Admin User', 'admin@example.com', hashedPassword, 'admin'],
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}