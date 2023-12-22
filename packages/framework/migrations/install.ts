import { sql } from "@framework/database/connection";

export async function installMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
        id serial PRIMARY KEY,
        migration varchar(255) NOT NULL,
        batch int NOT NULL,
        created_at timestamp DEFAULT NOW()
    );
`;
}
