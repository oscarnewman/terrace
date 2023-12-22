export abstract class Migration {
  public abstract up(): Promise<any>;
  public abstract down(): Promise<any>;
}
