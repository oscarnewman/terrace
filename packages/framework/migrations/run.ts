import { sql } from "@framework/database/connection";
import { Migration } from "@framework/migrations";
import { installMigrationsTable } from "@framework/migrations/install";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

export async function runMigrations() {
  // check if migrations table exists
  const migrationsTable = await sql`
          select * from information_schema.tables where table_name = 'migrations';
          `;
  if (migrationsTable.rowCount === 0) {
    console.warn("No migrations table found, creating one now");
    await installMigrationsTable();
    console.info("Migrations table created");
  }

  const batch = await sql`
    select coalesce(max(batch), 0) + 1 as next_batch from migrations;
    `;
  const nextBatch = batch.rows[0].next_batch;

  const migrations = await sql`
    select * from migrations order by migration;
    `;
  const migrationsDir = path.join(process.cwd(), "database/migrations");
  // find all migrations in `database/migrations` and list them out
  const files = await fs.readdir(migrationsDir);
  // all migration files have a default export of a class that extends Migration
  // the migration name is the file name
  const migrationFiles = files
    .filter((file) => file.endsWith(".ts"))
    .sort((a, b) => {
      const aDate = a.split("_")[0];
      const bDate = b.split("_")[0];
      return aDate.localeCompare(bDate);
    });
  const migrationClasses = await Promise.all(
    migrationFiles.map((file) => import(path.join(migrationsDir, file)))
  );
  const migrationNames = migrationFiles.map((file) => file.replace(".ts", ""));
  let toRun: { name: string; mClass: any }[] = [];
  for (let i = 0; i < migrationClasses.length; i++) {
    toRun.push({
      name: migrationNames[i],
      mClass: migrationClasses[i].default,
    });
  }

  // find the migrations that have already been run
  const ranMigrations = migrations.rows.map((row) => row.migration);

  // filter out migrations that have already been run
  toRun = toRun.filter((m) => !ranMigrations.includes(m.name));
  if (toRun.length === 0) {
    console.info("No migrations to run");
    return;
  }
  console.debug(`Migrations to run: ${toRun.length}`);

  // run the migrations
  for (const migration of toRun) {
    console.info(chalk.gray(`Running  ${migration.name}`));
    const m: Migration = new migration.mClass();
    await sql`begin`;

    const tables = await sql`
			select * from information_schema.tables where table_name <> 'migrations' and table_schema = 'public';
	`;
    await m.up();
    // check if the migration created a table, and if it did, call manage_updated_at (in sql) on that table
    // if the table doesn't have an updated_at column and created_at column, throw an error

    const newTables = await sql`
			select * from information_schema.tables where table_name <> 'migrations' and table_schema = 'public';
		`;

    const createdTables = newTables.rows.filter(
      (row) => !tables.rows.map((r) => r.table_name).includes(row.table_name)
    );

    // ensure new table has timestamps
    for (const table of createdTables) {
      const columns = await sql`
				select * from information_schema.columns where table_name = ${table.table_name};
			`;
      const columnNames = columns.rows.map((row) => row.column_name);
      if (!columnNames.includes("created_at")) {
        throw new Error(
          `Table ${table.table_name} does not have a created_at column`
        );
      }
      if (!columnNames.includes("updated_at")) {
        throw new Error(
          `Table ${table.table_name} does not have an updated_at column`
        );
      }
    }

    for (const table of createdTables) {
      await sql`select manage_updated_at(${table.table_name})`;
    }

    await sql`
      insert into migrations (migration, batch) values (${migration.name}, ${nextBatch});
  `;
    await sql`commit`;
    console.info(chalk.white.bold(`Finished ${migration.name}`));
  }
}
