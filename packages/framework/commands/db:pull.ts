import { Command } from 'cli/command'
import { loadSchemaAndWrite } from '@framework/codegen'

export default class extends Command {
  public async handle(): Promise<void> {
    await loadSchemaAndWrite()
  }
}
