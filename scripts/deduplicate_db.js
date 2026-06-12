const { Client } = require('pg');

const connectionString = 'postgresql://postgres:re4fn2FY0RZHXdCR@db.mirehrrlyedurrnrwvjn.supabase.co:5432/postgres';

const tables = [
  'english_mcqs',
  'pakistan_studies_mcqs',
  'general_knowledge_mcqs',
  'computer_science_mcqs',
  'mathematics_mcqs',
  'islamiat_mcqs',
  'note_topic_mcqs'
];

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database to check and remove duplicate questions.');

    for (const table of tables) {
      console.log(`\nAnalyzing table: ${table}...`);
      
      // Fetch all rows
      const res = await client.query(`SELECT id, question FROM public."${table}"`);
      const rows = res.rows;
      console.log(`Found ${rows.length} total rows.`);

      const seen = new Map(); // normalized_question -> id
      const duplicateIds = [];

      for (const row of rows) {
        const normalized = row.question.trim().toLowerCase();
        if (seen.has(normalized)) {
          duplicateIds.push(row.id);
        } else {
          seen.set(normalized, row.id);
        }
      }

      if (duplicateIds.length === 0) {
        console.log(`No duplicate questions found in ${table}.`);
      } else {
        console.log(`Found ${duplicateIds.length} duplicate questions in ${table}.`);
        console.log(`IDs to delete:`, duplicateIds);

        // Delete duplicates
        // We delete in batches or using IN clause
        const placeholders = duplicateIds.map((_, i) => `$${i + 1}`).join(',');
        const deleteQuery = `DELETE FROM public."${table}" WHERE id IN (${placeholders})`;
        const deleteRes = await client.query(deleteQuery, duplicateIds);
        console.log(`Successfully deleted ${deleteRes.rowCount} duplicate rows from ${table}.`);
      }
    }

  } catch (err) {
    console.error('Error during deduplication:', err);
  } finally {
    await client.end();
  }
}

main();
