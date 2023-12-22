import { Command } from 'cli/command'
import { resetDatabase } from '~/migrations/reset'

export default class extends Command {
  public async handle(): Promise<void> {
    await resetDatabase()
  }
}
