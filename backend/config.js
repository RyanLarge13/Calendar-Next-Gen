import pg from "pg";
const { Pool } = pg;

const connectionString = process.env.POSTGRESQL_CONNECTION;

const port = process.env.PGPORT;
const database = process.env.PGDATABASE;
const host = process.env.PGHOST;
const user = process.env.PGUSER;
const password = process.env.PGPASSWORD;

const pool = (() => {
  return new Pool({
    connectionString,
    user, 
    host, 
    database, 
    password, 
    port
  });
})();

export default pool;
