import postgres from "postgres";

export const sql = postgres({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  debug: true,
}); // will use psql environment variables

// export default { sqlSensors, sqlUsers };
