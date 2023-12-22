import { Command } from "cli/command";

export default class extends Command {
  public async handle(): Promise<void> {
    const name = this.args._[0];
    if (!name) {
      console.error("Please provide a name");
      return;
    }
    console.log(`boo ${this.args._[0]}`);
  }
}
