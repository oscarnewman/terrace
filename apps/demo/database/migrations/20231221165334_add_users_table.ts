import { sql } from "framework/database/connection"
import { Migration } from "framework/migrations"

export default class extends Migration {
	/**
	 * Run the migrations.
	 */
	async up() {
		await sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      email_verified_at TIMESTAMP,
      password text,
      remember_token text,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    `
	}

	/**
	 * Reverse the migrations.
	 */
	async down() {
		await sql`
    DROP TABLE users;
    `
	}
}
