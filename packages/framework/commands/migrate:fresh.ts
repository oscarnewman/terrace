import { Command } from 'cli/command'
import { installMigrationsTable } from '@framework/migrations/install'
import { resetDatabase } from '@framework/migrations/reset'
import { runMigrations } from '@framework/migrations/run'

export default class extends Command {
  public async handle(): Promise<void> {
    await resetDatabase()
    await installMigrationsTable()
    await runMigrations()
  }
}
