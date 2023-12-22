import minimist from 'minimist'

export abstract class Command {
  protected args: minimist.ParsedArgs

  constructor(argv: string[]) {
    this.args = minimist(argv)
  }

  /**
   * Execute the console command.
   */
  public abstract handle(): Promise<void>
}
