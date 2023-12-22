import minimist from "minimist";
import "reflect-metadata";

export abstract class Command {
  protected args: minimist.ParsedArgs;

  constructor(argv: string[]) {
    this.args = minimist(argv);
  }

  /**
   * Execute the console command.
   */
  public abstract handle(): Promise<void>;
}
