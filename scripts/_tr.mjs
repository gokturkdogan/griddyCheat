import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT players FROM worldcupyoungest WHERE country = 'Türkiye'`;
console.log(JSON.stringify(rows[0]?.players, null, 2));
