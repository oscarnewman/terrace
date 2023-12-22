import { Command } from "cli/command";
import { runMigrations } from "~/migrations/run";

export default class extends Command {
  public async handle(): Promise<void> {
    await runMigrations();
  }
}
