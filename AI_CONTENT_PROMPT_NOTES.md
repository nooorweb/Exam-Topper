# MASTER PROMPT — Study Notes Content Generation for Exam Topper App
# Give this entire document to your AI (e.g. ChatGPT, Claude, Gemini)
# The AI must return a .sql file you can paste directly into Supabase SQL Editor

---

## CONTEXT

You are generating study notes seed data for a Pakistani competitive exam preparation app called "Exam Topper". The notes section provides structured, exam-focused study topics for KPPSC, ETEA, FPSC, CSS, PMS, FIA, and NTS exams.

---

## CRITICAL RULES

1. **id** must follow the subject prefix pattern:
   - English notes: `'eng-note-3'`, `'eng-note-4'`, ... (continue from 3, existing are 1-2)
   - Mathematics: `'math-note-3'`, `'math-note-4'`, ... (continue from 3, existing are 1-2)
   - General Knowledge: `'gk-note-5'`, `'gk-note-6'`, ... (continue from 5, existing are 1-4)
   - Pakistan Studies: `'ps-note-1'`, `'ps-note-2'`, ... (none exist yet, start from 1)
   - Computer Science: `'cs-note-2'`, `'cs-note-3'`, ... (continue from 2, existing is 1)
   - Islamiat: `'isl-note-1'`, `'isl-note-2'`, ... (none exist yet, start from 1)

2. **key_points** — JSON array of strings. Each string is a key exam point. Must have 4–8 points. Format: `'["Point 1 text.","Point 2 text."]'`
3. **formulas** — JSON array of formula objects OR `null`. Only for Math/CS. Format:
   `'[{"name":"Formula name","equation":"formula text","application":"how to use it"}]'`
4. **tables_data** — JSON array of table objects OR `null`. Format:
   `'[{"headers":["Col1","Col2","Col3"],"rows":[["R1C1","R1C2","R1C3"],["R2C1","R2C2","R2C3"]]}]'`
5. **exam_targets** — JSON array of exam names. Use values from this set ONLY:
   `"KPPSC"`, `"ETEA"`, `"CSS"`, `"Teaching"`, `"Police"`, `"Computer Operator"`, `"FPSC"`, `"FIA"`, `"NTS"`
6. **importance** — Only: `'critical'`, `'high'`, or `'medium'`
7. **estimated_read_time** — Integer (minutes). Typically 4–10 minutes.
8. **Apostrophes** — escape with `''` inside SQL strings
9. **content** — A practical tip or memory trick, NOT a full repeat of key_points. 2–4 sentences.
10. **overview** — 1–2 sentences introducing why this topic matters for exams.

---

## EXISTING NOTES (DO NOT REPEAT THESE)

**English:** Conditional Sentences Mastery, High-Yield Preposition list
**Mathematics:** Percentages & Failure Calculations, Proportions (Direct & Inverse)
**General Knowledge:** United Nations (UN) Overview, Organisation of Islamic Cooperation (OIC), South Asian Association for Regional Cooperation (SAARC), North Atlantic Treaty Organization (NATO)
**Computer Science:** OSI 7-Layer Reference Model

---

## DATABASE SCHEMA

**Table: `public.note_topics`**

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Pattern: `'subject-note-N'` |
| `subject` | TEXT | `'English'`, `'Mathematics'`, `'General Knowledge'`, `'Pakistan Studies'`, `'Computer Science'`, `'Islamiat'` |
| `title` | TEXT | Concise topic title |
| `overview` | TEXT | 1-2 sentence intro for exams |
| `content` | TEXT | Practical tip/memory trick |
| `key_points` | JSONB | Array of 4–8 key exam facts |
| `formulas` | JSONB | Array of formula objects OR null |
| `tables_data` | JSONB | Array of table objects OR null |
| `exam_targets` | JSONB | Array of exam name strings |
| `importance` | TEXT | `'critical'`, `'high'`, or `'medium'` |
| `estimated_read_time` | INT | Minutes (4–10) |
| `is_public` | BOOLEAN | Always true |

---

## EXACT SQL FORMAT TO FOLLOW

```sql
INSERT INTO public.note_topics (
  id, subject, title, overview, content, key_points,
  formulas, tables_data, exam_targets, importance, estimated_read_time, is_public
)
VALUES

('ps-note-1', 'Pakistan Studies', 'Pakistan Movement — Key Dates & Events',
 'The freedom movement from 1857 to 1947 is the most tested Pakistan Studies topic across all competitive exams.',
 'Use the mnemonic "1857-1906-1919-1930-1940-1947" to memorize key milestone years in order. Each year marks a turning point: Revolt, Muslim League, Khilafat, Allahabad Address, Lahore Resolution, Independence.',
 '["1857: War of Independence (Sepoy Mutiny) — start of British Crown rule replacing East India Company.","1906: All India Muslim League (AIML) founded in Dhaka on 30 December by Nawab Salimullah Khan.","1919: Montagu-Chelmsford Reforms; Khilafat Movement begins (1919-1924).","1930: Allahabad Address — Allama Iqbal first proposed a separate Muslim homeland in northwest India.","1940: Pakistan Resolution (Lahore Resolution) passed on 23 March at Minto Park, Lahore. Moved by A.K. Fazlul Haq.","1947: 14 August — Independence Day. Quaid-e-Azam became first Governor-General. Liaquat Ali Khan became first PM."]',
 null, null,
 '["KPPSC","ETEA","CSS","Teaching","Police","FPSC","FIA","NTS"]',
 'critical', 8, true),

ON CONFLICT (id) DO UPDATE SET
  subject              = EXCLUDED.subject,
  title                = EXCLUDED.title,
  overview             = EXCLUDED.overview,
  content              = EXCLUDED.content,
  key_points           = EXCLUDED.key_points,
  formulas             = EXCLUDED.formulas,
  tables_data          = EXCLUDED.tables_data,
  exam_targets         = EXCLUDED.exam_targets,
  importance           = EXCLUDED.importance,
  estimated_read_time  = EXCLUDED.estimated_read_time,
  is_public            = EXCLUDED.is_public;
```

> **Note:** The last VALUES entry must NOT have a trailing comma after the `)`. All others must.

---

## CONTENT REQUIREMENTS

### Topics to Generate (Generate ALL of these):

#### Pakistan Studies (8 notes — ids: ps-note-1 to ps-note-8)
1. `'Pakistan Movement — Key Dates & Events'` (1857–1947)
2. `'Quaid-e-Azam Muhammad Ali Jinnah — Biography & Role'`
3. `'Constitution of Pakistan — 1956, 1962, 1973 Comparison'`
4. `'Geography of Pakistan — Rivers, Mountains, Provinces'`
5. `'FATA Merger into KPK — 25th Constitutional Amendment 2018'`
6. `'Pakistan''s Nuclear Program — Timeline & Key Facts'`
7. `'CPEC — China Pakistan Economic Corridor Details'`
8. `'Important Constitutional Amendments — 8th, 13th, 17th, 18th, 25th'`

**exam_targets for all Pakistan Studies:** `'["KPPSC","ETEA","CSS","Teaching","Police","FPSC","FIA","NTS"]'`

---

#### General Knowledge (5 more notes — ids: gk-note-5 to gk-note-9)
5. `'Shanghai Cooperation Organisation (SCO)'`
6. `'Economic Cooperation Organisation (ECO)'`
7. `'World Records — Largest, Smallest, Longest, Highest'`
8. `'Nobel Prize — Categories, History & Recent Winners'`
9. `'G7 vs G20 — Members, Purpose, Key Summits'`

**exam_targets for GK:** `'["KPPSC","CSS","Teaching","Police","FPSC"]'`

For `gk-note-7` (World Records), include a **table** with headers: `["Category","Record Holder","Detail"]` and rows for: Largest country (Russia), Smallest country (Vatican), Longest river (Nile), Highest mountain (Everest), Deepest ocean (Pacific), Largest ocean (Pacific), Longest wall (Great Wall of China), Most populated country (India), Largest desert (Sahara), Largest lake (Caspian Sea)

---

#### English (4 more notes — ids: eng-note-3 to eng-note-6)
3. `'Active and Passive Voice — Complete Rules'`
4. `'Direct and Indirect Speech — Reporting Rules'`
5. `'Common One-Word Substitutions for Exams'`
6. `'High-Frequency CSS-Level Vocabulary List'`

For `eng-note-6` (Vocabulary List), include a **table** with headers: `["Word","Meaning","Category"]` and include 12 high-level words with their one-line meanings and exam category.

**exam_targets for English:** `'["KPPSC","ETEA","CSS","Teaching","Police","FPSC","FIA"]'`

---

#### Mathematics (3 more notes — ids: math-note-3 to math-note-5)
3. `'Time, Speed & Distance — Formula Sheet'`
4. `'LCM, HCF & Number System Tricks'`
5. `'Profit, Loss & Discount Calculations'`

For all Math notes, include **formulas** array with relevant equations.

**exam_targets for Math:** `'["ETEA","Teaching","Computer Operator","Police","FPSC","NTS"]'`

---

#### Computer Science (3 more notes — ids: cs-note-2 to cs-note-4)
2. `'MS Office Keyboard Shortcuts — Word, Excel, PowerPoint'`
3. `'Database Management — Keys, Normalization & SQL Basics'`
4. `'Cybersecurity Fundamentals — Types of Attacks & Defenses'`

For `cs-note-2` (MS Office), include a **table** with headers: `["Shortcut","Application","Function"]` and 15 essential shortcuts (e.g. Ctrl+Z, Ctrl+S, Ctrl+F, F5 in PowerPoint, Ctrl+Home, etc.)

**exam_targets for CS:** `'["ETEA","Computer Operator","KPPSC","FPSC","NTS"]'`

---

#### Islamiat (5 notes — ids: isl-note-1 to isl-note-5)
1. `'Holy Quran — Key Facts & Statistics'`
2. `'Life of Prophet Muhammad (PBUH) — Key Dates & Events'`
3. `'Khulafa-e-Rashideen — The Four Rightly Guided Caliphs'`
4. `'Five Pillars of Islam — Complete Details'`
5. `'Major Battles in Islamic History'`

For `isl-note-1` (Holy Quran), include a **table** with headers: `["Category","Detail"]` and rows for: Total Surahs (114), Total Paras/Juz (30), Total Ayats (~6236), First Surah (Al-Fatiha), Last Surah (An-Nas), Longest Surah (Al-Baqarah), Shortest Surah (Al-Kauthar), First Revelation (Surah Al-Alaq, Cave Hira, 610 CE), Last Revelation (Surah Al-Maidah 3 - some say Surah Al-Nasr).

For `isl-note-3` (Khulafa), include a **table** with headers: `["Caliph","Period","Key Achievement","Martyrdom"]` and rows for all 4 caliphs.

**exam_targets for Islamiat:** `'["KPPSC","ETEA","CSS","Teaching","Police","FPSC","NTS"]'`

---

## OUTPUT FORMAT

Return a SINGLE `.sql` file with ALL notes in one INSERT block (or multiple if needed by subject). Order: Pakistan Studies → GK (5 new) → English → Math → CS → Islamiat.

Start with:
```sql
-- ============================================================
-- Exam Topper — Study Notes Seed Data (AI Generated Batch)
-- Run AFTER supabase_schema.sql AND supabase_seed_notes.sql
-- Total: 28 new note topics across 6 subjects
-- ============================================================
```

**Return ONLY the SQL. No markdown outside the SQL code.**
