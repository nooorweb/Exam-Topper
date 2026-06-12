const { Client } = require('pg');

const connectionString = 'postgresql://postgres:re4fn2FY0RZHXdCR@db.mirehrrlyedurrnrwvjn.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database successfully.');

    // 1. Get all public tables
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n--- Existing Tables in "public" schema ---');
    if (resTables.rows.length === 0) {
      console.log('No tables found.');
    } else {
      for (const row of resTables.rows) {
        // Get row count for each table
        try {
          const countRes = await client.query(`SELECT COUNT(*) FROM public."${row.table_name}"`);
          console.log(`- ${row.table_name}: ${countRes.rows[0].count} rows`);
        } catch (e) {
          console.log(`- ${row.table_name}: (could not get count: ${e.message})`);
        }
      }
    }
  } catch (err) {
    console.error('Error connecting or querying database:', err);
  } finally {
    await client.end();
  }
}

main();
