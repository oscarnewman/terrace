export type Enum = {
  name: string
  values: string[]
}

export type Column = {
  name: string
  type: string
  default: string
  is_nullable: string
}

export type Table = {
  name: string
  columns: Column[]
}

export type InferredDatabaseSchema = {
  enums: Enum[]
  tables: Table[]
}
