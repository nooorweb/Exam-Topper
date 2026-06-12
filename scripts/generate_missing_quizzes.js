const fs = require('fs');
const path = require('path');
const https = require('https');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:re4fn2FY0RZHXdCR@db.mirehrrlyedurrnrwvjn.supabase.co:5432/postgres';

// 1. Read API Key from .env
function getApiKey() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_OPENROUTER_API_KEY\s*=\s*["']?([^"'\r\n]+)/);
    if (match) {
      return match[1];
    }
  }
  return '';
}

const openRouterKey = getApiKey();

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

// 2. Call Gemini API via OpenRouter
function generateMCQs(topic, apiKey) {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      return reject(new Error('OpenRouter API Key not found in .env'));
    }

    const prefix = topic.id.replace(/-note-/g, 'n').replace(/-/g, '') + '-q';

    const prompt = `You are an expert exam content generator for competitive exams.
Given the following study note topic, generate exactly 10 high-quality, conceptual, and fact-based multiple-choice questions (MCQs) testing different key details of the note.

Topic ID: ${topic.id}
Topic Title: ${topic.title}
Subject: ${topic.subject}
Overview: ${topic.overview}
Content: ${topic.content}
Key Points: ${topic.key_points}

Return ONLY a valid JSON array of objects representing the MCQs. Do not include markdown wraps (like \`\`\`json), explanation text, or conversational preambles.
Each object in the array MUST have this format:
{
  "id": "unique-human-readable-string", // e.g., "${prefix}1", "${prefix}2"
  "question": "The question text...",
  "options": ["Option A", "Option B", "Option C", "Option D"], // exactly 4 choices
  "correct_answer": 0, // integer index of correct option (0-3)
  "explanation": "Detailed explanation of why this option is correct...",
  "category": "${topic.subject}", // must match topic's subject
  "sort_order": 1 // integer starting from 1 to 10
}`;

    const postData = JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/google/smart-prep-mcqs',
        'X-Title': 'Smart Prep MCQ Builder'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(new Error(`API Error (HTTP ${res.statusCode}): ${data}`));
          }
          const response = JSON.parse(data);
          let text = response.choices[0].message.content.trim();
          
          // Strip markdown code block wrappers if any
          if (text.startsWith('```')) {
            text = text.replace(/^```[a-z]*\r?\n/i, '').replace(/\r?\n```$/, '');
          }
          text = text.trim();
          
          const mcqs = JSON.parse(text);
          resolve(mcqs);
        } catch (e) {
          reject(new Error(`Failed to parse API response: ${e.message}\nRaw response: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('API Key configured:', openRouterKey ? 'YES' : 'NO');
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    // 1. Fetch note topics
    const topicsRes = await client.query('SELECT id, subject, title, overview, content, key_points FROM public.note_topics');
    const topics = topicsRes.rows;

    // 2. Fetch counts of MCQs
    const countsRes = await client.query('SELECT note_topic_id, count(*) FROM public.note_topic_mcqs GROUP BY note_topic_id');
    const countsMap = {};
    countsRes.rows.forEach(r => {
      countsMap[r.note_topic_id] = parseInt(r.count, 10);
    });

    // 3. Find missing quizzes
    const missingTopics = [];
    topics.forEach(t => {
      const count = countsMap[t.id] || 0;
      if (count === 0) {
        missingTopics.push(t);
      }
    });

    console.log(`\nNote Topics count: ${topics.length}`);
    console.log(`Topics with missing quizzes: ${missingTopics.length}`);

    if (missingTopics.length === 0) {
      console.log('\nAll note topics currently have quizzes. No generation needed!');
      return;
    }

    const seedFile = path.join(__dirname, '..', 'supabase_seed_note_mcqs.sql');
    console.log(`\nGenerating quizzes for ${missingTopics.length} topics...`);

    for (const topic of missingTopics) {
      console.log(`\nGenerating 10 MCQs for: "${topic.title}" (ID: ${topic.id})...`);
      try {
        const mcqs = await generateMCQs(topic, openRouterKey);
        
        if (!Array.isArray(mcqs) || mcqs.length === 0) {
          console.warn(`Warning: API returned invalid data for topic ${topic.id}`);
          continue;
        }

        console.log(`Generated ${mcqs.length} MCQs. Seeding into database...`);

        // Insert into database and append to seed file
        fs.appendFileSync(seedFile, `\n\n-- Generated Quiz for Note Topic: ${topic.id} ("${topic.title}")\n`);
        
        for (const mcq of mcqs) {
          const optStr = JSON.stringify(mcq.options);
          
          // Database Seed
          await client.query(`
            INSERT INTO public.note_topic_mcqs 
              (id, note_topic_id, question, options, correct_answer, explanation, category, sort_order, is_public)
            VALUES 
              ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
              note_topic_id = EXCLUDED.note_topic_id,
              question = EXCLUDED.question,
              options = EXCLUDED.options,
              correct_answer = EXCLUDED.correct_answer,
              explanation = EXCLUDED.explanation,
              category = EXCLUDED.category,
              sort_order = EXCLUDED.sort_order,
              is_public = EXCLUDED.is_public;
          `, [
            mcq.id, topic.id, mcq.question, optStr,
            mcq.correct_answer, mcq.explanation, topic.subject,
            mcq.sort_order, true
          ]);

          // SQL file append
          const sqlStmt = `INSERT INTO public.note_topic_mcqs (id, note_topic_id, question, options, correct_answer, explanation, category, sort_order, is_public) VALUES ('${mcq.id}', '${topic.id}', '${escapeSql(mcq.question)}', '${escapeSql(optStr)}', ${mcq.correct_answer}, '${escapeSql(mcq.explanation)}', '${escapeSql(topic.subject)}', ${mcq.sort_order}, true) ON CONFLICT (id) DO UPDATE SET note_topic_id = EXCLUDED.note_topic_id, question = EXCLUDED.question, options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer, explanation = EXCLUDED.explanation, category = EXCLUDED.category, sort_order = EXCLUDED.sort_order, is_public = EXCLUDED.is_public;\n`;
          fs.appendFileSync(seedFile, sqlStmt);
        }

        console.log(`Successfully seeded and saved quiz for topic ${topic.id}.`);
      } catch (err) {
        console.error(`Error generating quiz for topic ${topic.id}:`, err.message);
      }
    }

    console.log('\nDone with quiz generation & seeding.');

  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await client.end();
  }
}

main();
