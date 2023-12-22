import { camelCase, upperFirst } from 'lodash'
import prettier from 'prettier'
import { Enum, InferredDatabaseSchema, Table } from '@framework/codegen/types'

function genereateEnumDefinitions(enums: Enum[]) {
  return enums
    .map(e => {
      return `export enum ${e.name} {
						${e.values.map(v => `${v} = "${v}"`).join(',\n')}
				}`
    })
    .join('\n\n')
}

function generateTableDefinition(table: Table) {
  let tsInterface = `${table.name}: {\n`

  for (const column of table.columns) {
    tsInterface += `    /**\n     * @default ${column.default}\n     * @nullable ${
      column.is_nullable === 'YES'
    }\n     */\n     ${column.name}: ${mapPostgresTypeToTypeScript(column.type)}${
      column.is_nullable === 'YES' ? ' | null | undefined' : ''
    }; // ${column.type}\n`
  }

  tsInterface += `}\n`
  return tsInterface
}

function generateTableDefinitions(tables: Table[]) {
  return `export interface Tables {
    ${tables.map(generateTableDefinition).join('\n')}
  }`
}

const postgresToTypeScriptTypeMap: { [key: string]: string } = {
  bigint: 'bigint',
  bigserial: 'bigint',
  bit: 'string',
  'bit varying': 'string',
  boolean: 'boolean',
  box: 'string',
  bytea: 'Buffer',
  character: 'string',
  'character varying': 'string',
  cidr: 'string',
  circle: 'string',
  date: 'Date',
  'double precision': 'number',
  inet: 'string',
  integer: 'number',
  interval: 'string',
  json: 'any',
  jsonb: 'any',
  line: 'string',
  lseg: 'string',
  macaddr: 'string',
  money: 'number',
  numeric: 'string',
  path: 'string',
  pg_lsn: 'string',
  point: 'string',
  polygon: 'string',
  real: 'number',
  smallint: 'number',
  smallserial: 'number',
  serial: 'number',
  text: 'string',
  time: 'string',
  'time with time zone': 'string',
  timestamp: 'Date',
  'timestamp with time zone': 'Date',
  'timestamp without time zone': 'Date',
  tsquery: 'string',
  tsvector: 'string',
  txid_snapshot: 'string',
  uuid: 'string',
  xml: 'string',
}

function mapPostgresTypeToTypeScript(postgresType: string): string {
  return postgresToTypeScriptTypeMap[postgresType] ?? 'any'
}

function generateClass(table: Table) {
  let classDefinition = `export class ${upperFirst(camelCase(table.name))} extends BaseModel {\n`
  classDefinition += `\tprotected static tableName = "${table.name}"\n\n`

  for (const column of table.columns) {
    classDefinition += `\t${column.name}: ${mapPostgresTypeToTypeScript(column.type)}${
      column.is_nullable === 'YES' ? ' | null | undefined' : ''
    };\n`
  }

  classDefinition += `}\n`
  return classDefinition
}

function generateClassesInNamespace(tables: Table[]) {
  return `export namespace DB {
		${tables.map(generateClass).join('\n\n')}
	}`
}

export async function generateTypes(schema: InferredDatabaseSchema) {
  const enums = genereateEnumDefinitions(schema.enums)
  const tables = generateTableDefinitions(schema.tables)
  const classes = generateClassesInNamespace(schema.tables)
  const prettierConfig = await prettier.resolveConfig(process.cwd())
  return prettier.format(
    `/* eslint-disable @typescript-eslint/no-namespace */
    import { BaseModel } from "framework/orm/base-model";
    ${enums}
    ${tables}
    ${classes}`,
    {
      ...prettierConfig,
      parser: 'typescript',
    },
  )
}
