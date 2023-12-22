import { Enum, InferredDatabaseSchema, Table } from '@framework/codegen/types'
import { sql } from '@framework/database/connection'

async function getEnums() {
  const enumResult = await sql`
        SELECT n.nspname as enum_schema,  
            t.typname as enum_name,  
            string_agg(e.enumlabel, ',') as enum_value  
        FROM pg_type t  
        JOIN pg_enum e ON t.oid = e.enumtypid  
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace  
        GROUP BY enum_schema, enum_name;
    `

  const enums: Enum[] = enumResult.rows.map(row => {
    return {
      name: row.enum_name,
      values: row.enum_value.split(','),
    }
  })

  return enums
}

async function getTables() {
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
`

  return tables.rows.map(row => row.table_name)
}

async function getColumns(table: string) {
  const columns = await sql`
    SELECT *
    FROM information_schema.columns
    WHERE table_name = ${table}
`

  return columns.rows.map(row => {
    return {
      name: row.column_name,
      type: row.data_type,
      default: row.column_default,
      is_nullable: row.is_nullable,
    }
  })
}

export async function loadSchema(): Promise<InferredDatabaseSchema> {
  const [enums, tables] = await Promise.all([getEnums(), getTables()])
  const columns = await Promise.all(tables.map(table => getColumns(table)))

  const tableSchemas: Table[] = tables.map((table, i) => {
    return {
      name: table,
      columns: columns[i],
    }
  })

  return {
    enums,
    tables: tableSchemas,
  }
}
