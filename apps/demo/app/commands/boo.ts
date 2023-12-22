import { Command } from "cli/command";

export default class extends Command {
  public async handle(): Promise<void> {
    console.log("boo");
  }
}
