import { Tables } from './_generated'

declare global {
  // @ts-expect-error Duplicate definition
  type TableDefinitions = Tables
}
