import postgres from "postgres";

// Connect to PostgreSQL, read the connection info from the
// environment variables we set in our .env file
const sql = postgres({
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USERNAME,
  database: process.env.POSTGRES_DATABASE,
});

export default sql;
