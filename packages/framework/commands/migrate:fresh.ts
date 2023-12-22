import { Command } from 'cli/command'
import { installMigrationsTable } from '~/migrations/install'
import { resetDatabase } from '~/migrations/reset'
import { runMigrations } from '~/migrations/run'

export default class extends Command {
  public async handle(): Promise<void> {
    await resetDatabase()
    await installMigrationsTable()
    await runMigrations()
  }
}
