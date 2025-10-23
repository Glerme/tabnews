import { query } from "@/infra/database";

test("GET to /api/v1/status should return 200", async () => {
  const result = await query("SELECT 1 + 1 as sum;");
  console.log(result.rows);

  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);
});
