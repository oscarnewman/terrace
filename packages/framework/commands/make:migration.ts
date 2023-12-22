import chalk from 'chalk'
import { Command } from 'cli/command'
import fs from 'fs/promises'
import path from 'path'

export default class MakeMigration extends Command {
  public async handle() {
    const name = this.args._[0]
    if (!name) {
      console.log('Please provide a name for the migration')
      return
    }

    const tableName = this.args.table ?? this.args.T ?? undefined

    const template = tableName ? templates.createTable(tableName) : templates.base()

    // migration name pattern is 20231218193824_create_users_table.ts
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const dateStr = `${year}${month}${day}${hours}${minutes}${seconds}`

    // normalize the name to be lowercase and snake_case
    const normalizedName = name.toLowerCase().replace(/ /g, '_')
    const fileName = `${dateStr}_${normalizedName}.ts`

    const filePath = path.join(process.cwd(), 'database', 'migrations', fileName)
    await fs.writeFile(filePath, template)
    console.log(chalk.green(`Created migration ${chalk.bold(fileName)}`))
  }
}

const templates = {
  base: () => `import { sql } from "database";
import { Migration } from "framework/database/Migration";

export default class extends Migration {
  /**
   * Run the migrations.
   */
  async up() {
    await sql\`
    -- write your migration here
    \`;
  }

  /**
   * Reverse the migrations.
   */
  async down() {
    await sql\`
    -- write your rollback here
    \`;
  }
}`,
  createTable: (tableName: string) => `import { sql } from "database";
import { Migration } from "framework/database/Migration";

export default class extends Migration {
  /**
   * Run the migrations.
   */
  async up() {
    await sql\`
    CREATE TABLE ${tableName} (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    \`;
  }

  /**
   * Reverse the migrations.
   */
  async down() {
    await sql\`
    DROP TABLE ${tableName};
    \`;
  }
}`,
}
