import { sql } from '~/database/connection'

export async function resetDatabase() {
  await sql`
        DO
        $$
        DECLARE
            rec record;
        BEGIN
            -- Dropping all tables except 'migrations'
            FOR rec IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
            LOOP
                EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(rec.tablename) || ' CASCADE';
            END LOOP;

            -- Dropping all views
            FOR rec IN SELECT viewname FROM pg_views WHERE schemaname = 'public'
            LOOP
                EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(rec.viewname) || ' CASCADE';
            END LOOP;

            -- Dropping all sequences
            FOR rec IN SELECT sequencename FROM pg_sequences WHERE schemaname = 'public'
            LOOP
                EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(rec.sequencename) || ' CASCADE';
            END LOOP;

            -- Dropping all materialized views
            FOR rec IN SELECT matviewname FROM pg_matviews WHERE schemaname = 'public'
            LOOP
                EXECUTE 'DROP MATERIALIZED VIEW IF EXISTS public.' || quote_ident(rec.matviewname) || ' CASCADE';
            END LOOP;

            -- Dropping only user-defined types (enums and composite types)
            FOR rec IN SELECT typname FROM pg_type WHERE typtype IN ('e', 'c') AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            LOOP
                EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(rec.typname) || ' CASCADE';
            END LOOP;

            -- Dropping all functions
            FOR rec IN SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            LOOP
                EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(rec.proname) || ' CASCADE';
            END LOOP;

            -- Note: Dropping extensions can be risky as they might be required by the system or other databases
            -- Uncomment the following code if you are sure you need to drop extensions
            -- FOR rec IN SELECT extname FROM pg_extension WHERE extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
            -- LOOP
            --     EXECUTE 'DROP EXTENSION IF EXISTS ' || quote_ident(rec.extname) || ' CASCADE';
            -- END LOOP;
        END
        $$;
        `
}
