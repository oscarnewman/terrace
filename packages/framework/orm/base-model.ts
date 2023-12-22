import pluralize from 'pluralize'
import { raw } from 'sql-template-tag'
import { sql } from '@framework/database/connection'

export class BaseModel {
  protected static tableName: string

  public static getTableName() {
    // either use the static tableName property or infer it from the class name
    return this.tableName || pluralize(this.name.toLocaleLowerCase())
  }

  static fromRow<T extends typeof BaseModel>(this: T, row: Record<string, any>): InstanceType<T> {
    const instance = new this()
    Object.keys(row).forEach(key => {
      if (key in instance) {
        ;(instance as any)[key] = row[key]
      }
    })
    return instance as InstanceType<T>
  }

  static async all<T extends typeof BaseModel>(this: T): Promise<InstanceType<T>[]> {
    const result = await sql`
			SELECT *
			FROM ${raw(this.getTableName())};
		`

    return result.rows.map(row => this.fromRow(row))
  }

  static async find<T extends typeof BaseModel>(
    this: T,
    id: number,
  ): Promise<InstanceType<T> | null> {
    const result = await sql`
			SELECT *
			FROM ${raw(this.getTableName())}
			WHERE id = ${id};
		`

    if (result.rows.length === 0) {
      return null
    }

    return this.fromRow(result.rows[0])
  }
}
