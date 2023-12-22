import pg from "pg";
import { format } from "sql-formatter";
import { highlight } from "sql-highlight";
import _sql from "sql-template-tag";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// the pool will emit an` error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err: any) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export function prettyPrintSql(sql: string) {
  const printed = format(sql, { language: "postgresql" });
  const highlighted = highlight(printed);
  return highlighted;
}

export async function sql(strings: TemplateStringsArray, ...vals: any[]) {
  const { text, values } = _sql(strings, ...vals);
  return exec(text, values);
}

export async function exec(query: string, values: any[]) {
  const noWhitespace = query.replace(/\s+/g, " ").trim();
  // console.debug(`Running query\n${prettyPrintSql(query)}`);
  const result = await pool.query(query, values);
  return result;
}
export const sqlFragment = _sql;
