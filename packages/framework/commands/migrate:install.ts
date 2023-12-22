import { Command } from 'cli/command'
import { installMigrationsTable } from '@framework/migrations/install'

export default class extends Command {
  public async handle(): Promise<void> {
    await installMigrationsTable()
  }
}
