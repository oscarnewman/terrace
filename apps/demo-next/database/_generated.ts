/* eslint-disable @typescript-eslint/no-namespace */
import { BaseModel } from 'framework/orm/base-model'

export interface Tables {
  migrations: {
    /**
     * @default nextval('migrations_id_seq'::regclass)
     * @nullable false
     */
    id: number // integer
    /**
     * @default null
     * @nullable false
     */
    batch: number // integer
    /**
     * @default now()
     * @nullable true
     */
    created_at: Date | null | undefined // timestamp without time zone
    /**
     * @default null
     * @nullable false
     */
    migration: string // character varying
  }

  users: {
    /**
     * @default nextval('users_id_seq'::regclass)
     * @nullable false
     */
    id: number // integer
    /**
     * @default null
     * @nullable true
     */
    email_verified_at: Date | null | undefined // timestamp without time zone
    /**
     * @default now()
     * @nullable true
     */
    created_at: Date | null | undefined // timestamp without time zone
    /**
     * @default now()
     * @nullable true
     */
    updated_at: Date | null | undefined // timestamp without time zone
    /**
     * @default null
     * @nullable true
     */
    password: string | null | undefined // text
    /**
     * @default null
     * @nullable false
     */
    name: string // text
    /**
     * @default null
     * @nullable false
     */
    email: string // text
    /**
     * @default null
     * @nullable true
     */
    remember_token: string | null | undefined // text
  }
}
export namespace DB {
  export class Migrations extends BaseModel {
    protected static tableName = 'migrations'

    id: number
    batch: number
    created_at: Date | null | undefined
    migration: string
  }

  export class Users extends BaseModel {
    protected static tableName = 'users'

    id: number
    email_verified_at: Date | null | undefined
    created_at: Date | null | undefined
    updated_at: Date | null | undefined
    password: string | null | undefined
    name: string
    email: string
    remember_token: string | null | undefined
  }
}
