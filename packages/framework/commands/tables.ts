import chalk from "chalk";
import { Command } from "cli/command";
import { sql } from "~/database/connection";

export default class extends Command {
  public async handle(): Promise<void> {
    const result = await sql`
    SELECT * FROM information_schema.tables
    WHERE table_schema = 'public'
    `;

    if (result.rowCount === 0) {
      console.warn("No tables found");
      return;
    }
    console.log(chalk.whiteBright("Tables:"));
    console.log(result.rows.map((r) => r.table_name).join("\n"));
  }
}
