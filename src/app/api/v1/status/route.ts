import type { NextRequest } from "next/server";
import { query } from "@/infra/database";

export async function GET(request: NextRequest) {
  const updatedAt = new Date().toISOString();

  const databaseVersionQuery = await query("SHOW server_version;");
  const databaseVersionValue = databaseVersionQuery.rows[0].server_version;

  const databaseMaxConnectionsQuery = await query("SHOW max_connections;");
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsQuery.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsQuery = await query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsQuery.rows[0].count;

  return Response.json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: Number(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
