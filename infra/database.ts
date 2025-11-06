import { Client, Pool } from "pg";

export const query = async (queryObject: any) => {
  if (!process.env.POSTGRES_PASSWORD) {
    console.warn("[database.ts] POSTGRES_PASSWORD is not defined");
  }

  const pool = new Pool();

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
