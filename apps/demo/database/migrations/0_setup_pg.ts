import { Migration } from "framework/migrations";
import { sql } from "framework/database/connection";

export default class extends Migration {
  /**
   * Run the migrations.
   */
  async up() {
    await sql`
    CREATE OR REPLACE FUNCTION manage_updated_at(_tbl regclass) RETURNS VOID AS $$
    BEGIN
        EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %s
                        FOR EACH ROW EXECUTE PROCEDURE set_updated_at()', _tbl);
    END;
    $$ LANGUAGE plpgsql;
  `;

    await sql`
    CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
    BEGIN
        IF (
            NEW IS DISTINCT FROM OLD AND
            NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at
        ) THEN
            NEW.updated_at := current_timestamp;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;
  }

  /**
   * Reverse the migrations.
   */
  async down() {
    sql`
    DROP FUNCTION IF EXISTS manage_updated_at(regclass);
    DROP FUNCTION IF EXISTS set_updated_at();
    `;
  }
}
