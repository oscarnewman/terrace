import { Sql, join, raw } from 'sql-template-tag'
import { exec, sqlFragment } from '@framework/database/connection'

type FieldOperator = '=' | '<' | '>' | '<=' | '>=' | '!=' | 'like' | 'ilike'
type FieldComparison<T> = {
  type: 'comp'
  field: T
  operator: FieldOperator | 'in'
  value: string | string[] // Array for 'in' operator
}

type AndWhereClause<T> = {
  type: 'and'
  and: WhereClause<T>[]
}

type OrWhereClause<T> = {
  type: 'or'
  or: WhereClause<T>[]
}

type NotWhereClause<T> = {
  type: 'not'
  not: WhereClause<T>[]
}
declare global {
  // @ts-ignore
  export type TableDefinitions = Record<string, Record<string, any>>
}
type TableName = keyof TableDefinitions

type RootWhereClause<T> = AndWhereClause<T> | OrWhereClause<T> | NotWhereClause<T>
type WhereClause<T> = FieldComparison<T> | RootWhereClause<T>
type WhereCallback<T extends keyof TableDefinitions> = (qb: Query<T>) => Query<T>

export class Query<T extends keyof TableDefinitions> {
  // instance params
  private table: string
  private _where: WhereClause<keyof TableDefinitions[T]> | null = null
  private _whereParams: Record<string, any> = {}

  constructor(table: TableName) {
    this.table = table
  }

  static table<T extends TableName>(table: TableName) {
    return new Query<T>(table)
  }

  where(field: keyof TableDefinitions[T], value: string): Query<T>
  where(callback: WhereCallback<T>): Query<T>
  where(a: WhereCallback<T> | keyof TableDefinitions[T], b?: string): Query<T> {
    if (typeof a === 'function') {
      return this._whereGroup(a)
    }

    return this._whereSingle(a, b!)
  }
  private _whereSingle(field: keyof TableDefinitions[T], value: string) {
    if (!this._where) {
      this._where = { type: 'comp', field: field, operator: '=', value: value }
      return this
    }

    this._where = {
      type: 'and',
      and: [this._where, { type: 'comp', field: field, operator: '=', value: value }],
    }
    return this
  }

  private _whereGroup(callback: (qb: Query<T>) => Query<T>) {
    const qb = callback(new Query(this.table))
    if (!this._where) {
      this._where = qb._where
      return this
    }

    if (!qb._where) {
      return this
    }

    this._where = {
      type: 'and',
      and: [this._where, qb._where],
    }
    return this
  }

  private _orWhereGroup(callback: (qb: Query<T>) => Query<T>) {
    const qb = callback(new Query(this.table))
    if (!this._where) {
      this._where = qb._where
      return this
    }

    if (!qb._where) {
      return this
    }

    this._where = {
      type: 'or',
      or: [this._where, qb._where],
    }
    return this
  }

  orWhere(field: keyof TableDefinitions[T], value: string): Query<T>
  orWhere(callback: WhereCallback<T>): Query<T>
  orWhere(a: WhereCallback<T> | keyof TableDefinitions[T], b?: string): Query<T> {
    if (typeof a === 'function') {
      return this._orWhereGroup(a)
    }

    return this._orWhere(a, b!)
  }

  private _orWhere(field: keyof TableDefinitions[T], value: string): Query<T> {
    if (!this._where) {
      this._where = { type: 'comp', field: field, operator: '=', value: value }
      return this
    }

    this._where = {
      type: 'or',
      or: [this._where, { type: 'comp', field: field, operator: '=', value: value }],
    }
    return this
  }

  whereNot(field: keyof TableDefinitions[T], value: string) {
    if (!this._where) {
      this._where = { type: 'comp', field: field, operator: '!=', value: value }
      return this
    }

    this._where = {
      type: 'and',
      and: [this._where, { type: 'comp', field: field, operator: '!=', value: value }],
    }
    return this
  }

  private buildWhere(clause: WhereClause<keyof TableDefinitions[T]> | null): Sql {
    if (!clause) return sqlFragment``
    switch (clause.type) {
      case 'comp':
        return sqlFragment`${raw(String(clause.field))} ${raw(clause.operator)} ${clause.value}`
      case 'and':
        return sqlFragment`(${join(
          clause.and.map(c => this.buildWhere(c)),
          ' AND ',
        )})`

      case 'or':
        return sqlFragment`(${join(
          clause.or.map(c => this.buildWhere(c)),
          ' OR ',
        )})`

      case 'not':
        return sqlFragment`NOT (${join(
          clause.not.map(c => this.buildWhere(c)),
          ' AND ',
        )})`
    }
  }

  async get() {
    let statement = sqlFragment`SELECT * FROM ${raw(this.table)}`
    if (this._where) {
      statement = join([statement, this.buildWhere(this._where)], ' WHERE ')
    }

    const result = await exec(statement.text, statement.values)
    return result.rows
  }
}
