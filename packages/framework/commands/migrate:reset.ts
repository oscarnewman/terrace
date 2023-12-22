import { Command } from 'cli/command'
import { installMigrationsTable } from '@framework/migrations/install'
import { resetDatabase } from '@framework/migrations/reset'

export default class extends Command {
  public async handle(): Promise<void> {
    await resetDatabase()
  }
}
