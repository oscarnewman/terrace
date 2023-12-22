import { Command } from "cli/command";
import { installMigrationsTable } from "~/migrations/install";

export default class extends Command {
  public async handle(): Promise<void> {
    await installMigrationsTable();
  }
}
