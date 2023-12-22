import { Command } from "cli/command";
import { installMigrationsTable } from "~/migrations/install";
import { resetDatabase } from "~/migrations/reset";

export default class extends Command {
  public async handle(): Promise<void> {
    await resetDatabase();
  }
}
