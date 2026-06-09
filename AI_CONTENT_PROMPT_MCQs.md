# MASTER PROMPT — MCQ Content Generation for Exam Topper App
# Give this entire document to your AI (e.g. ChatGPT, Claude, Gemini)
# The AI must return a .sql file you can paste directly into Supabase SQL Editor

---

## CONTEXT

You are generating MCQ (Multiple Choice Question) seed data for a Pakistani competitive exam preparation app called "Exam Topper". The app serves students preparing for KPPSC, ETEA, FPSC, CSS, FIA, NTS, and PMS exams.

The data must be inserted into a PostgreSQL database (Supabase). The target audience is KPK (Khyber Pakhtunkhwa) province exam aspirants primarily, but also national-level exam students.

---

## CRITICAL RULES — READ BEFORE GENERATING

1. **NO duplicate IDs** — Every MCQ must have a globally unique UUID v4. Generate them properly (e.g. `gen_random_uuid()` style: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`).
2. **correct_answer is an integer 0–3** — NOT a letter. `0 = option A`, `1 = option B`, `2 = option C`, `3 = option D`. Double-check every answer index.
3. **options is a JSON array** — Format EXACTLY as: `'["Option A text","Option B text","Option C text","Option D text"]'`
4. **Single quotes in text** — PostgreSQL requires `''` (double single quote) to escape an apostrophe inside a string. Example: `'Pakistan''s capital'` not `'Pakistan's capital'`
5. **difficulty values** — Only use: `'high'` or `'medium'` (NO 'easy' — the app targets hard/medium questions)
6. **importance values** — Only use: `'high'` or `'medium'` or `'low'`
7. **exam_type format** — Must follow this pattern: `'KPPSC Tehsildar 2023'` or `'ETEA Computer Operator 2022'` or `'CSS General Ability 2021'` or `'FPSC Inspector 2024'` or `'FIA Sub-Inspector 2023'` or `'NTS Junior Clerk 2022'`. MUST include the year.
8. **Every INSERT block must end with** the `ON CONFLICT` clause shown below.
9. **Generate at least 50 MCQs per subject table** — more is better.
10. **Quality over quantity** — All questions must be factually accurate. Explain why the correct answer is correct AND why the distractors are wrong.
11. **is_repeated = true** for questions that have appeared in multiple past papers. Set `repeat_count` to the estimated number of times it has appeared (2–10).

---

## DATABASE SCHEMA REFERENCE

There are 6 subject tables. They all have **identical column structure**:

```
TABLE: public.english_mcqs
TABLE: public.pakistan_studies_mcqs  
TABLE: public.general_knowledge_mcqs
TABLE: public.computer_science_mcqs
TABLE: public.mathematics_mcqs
TABLE: public.islamiat_mcqs
```

### Column Definitions:
| Column | Type | Rules |
|---|---|---|
| `id` | UUID (TEXT) | Unique UUID v4 string |
| `question` | TEXT | The question text. Escape apostrophes with `''` |
| `options` | JSONB (TEXT) | JSON array of exactly 4 string options |
| `correct_answer` | SMALLINT | Integer: 0, 1, 2, or 3 |
| `explanation` | TEXT | Why the correct answer is right. Escape apostrophes |
| `subcategory` | TEXT | Topic within the subject (see lists below) |
| `exam_type` | TEXT | Specific exam + year (see format above) |
| `difficulty` | TEXT | `'high'` or `'medium'` ONLY |
| `is_repeated` | BOOLEAN | `true` if seen in multiple papers, else `false` |
| `repeat_count` | SMALLINT | 0 if not repeated, else 2–10 |
| `importance` | TEXT | `'high'` or `'medium'` or `'low'` |
| `is_public` | BOOLEAN | Always `true` |

---

## EXACT SQL FORMAT TO FOLLOW

Copy this structure for each subject. Do NOT deviate:

```sql
-- ─────────────────────────────────────────────────────────────
-- 1. English MCQs  →  english_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.english_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
   'Question text here.',
   '["Option A","Option B","Option C","Option D"]',
   1,
   'Explanation of why Option B is correct and others are wrong.',
   'Grammar', 'KPPSC Tehsildar 2023', 'high', true, 4, 'high', true),

  ('yyyyyyyy-yyyy-4yyy-yyyy-yyyyyyyyyyyy',
   'Second question text.',
   '["A","B","C","D"]',
   0,
   'Explanation.',
   'Vocabulary', 'ETEA SST 2022', 'medium', false, 0, 'medium', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;
```

> **Note:** The last value before `ON CONFLICT` must NOT have a trailing comma. All others must have a comma.

---

## CONTENT REQUIREMENTS PER SUBJECT

### 1. ENGLISH (Table: `english_mcqs`) — Generate 60 MCQs

**Subcategories to cover:**
- `'Grammar'` — Tenses, Conditionals, Active/Passive Voice, Direct/Indirect Speech
- `'Vocabulary'` — Synonyms, Antonyms (CSS/KPPSC level words)
- `'Prepositions'` — Fill in the blank with correct preposition
- `'Idioms & Phrases'` — Meaning of idioms
- `'Sentence Correction'` — Choose the grammatically correct sentence
- `'One Word Substitution'` — Find the one-word meaning
- `'Reading Comprehension'` — Short passage-based questions

**Exam types to use:** `'KPPSC Tehsildar 2023'`, `'ETEA SST General 2024'`, `'CSS English 2022'`, `'FPSC Inspector 2023'`, `'FIA Sub-Inspector 2022'`, `'NTS Junior Clerk 2023'`, `'KPPSC PMS 2021'`

**Quality bar:** Use words at CSS/PMS level difficulty — words like ephemeral, obstinate, sycophant, laconic, equivocal, bellicose, etc.

---

### 2. PAKISTAN STUDIES (Table: `pakistan_studies_mcqs`) — Generate 70 MCQs

**Subcategories to cover:**
- `'Freedom Movement'` — Partition, Jinnah, Muslim League, key resolutions and dates
- `'Geography'` — Rivers, mountains, provinces, borders, districts
- `'Early History'` — First PM, President, Governor General, constitutional events 1947–1956
- `'Constitution'` — 1956, 1962, 1973 constitution facts; key amendments (8th, 13th, 17th, 18th, 25th)
- `'Governance'` — FATA merger, KPK governance, devolution, NFC Award
- `'Current Affairs'` — Events 2020–2025 (CPEC, elections, PM/President changes, policies)
- `'Literature'` — Key books on Pakistan by K.K. Aziz, Ayesha Jalal, etc.
- `'Economy'` — Budget facts, GDP, trade partners, IMF loans

**Exam types to use:** `'KPPSC Tehsildar 2023'`, `'KPPSC PMS 2022'`, `'ETEA PST 2024'`, `'CSS Pakistan Affairs 2023'`, `'FPSC ASI 2022'`, `'FIA Inspector 2021'`, `'NTS 2023'`

---

### 3. GENERAL KNOWLEDGE (Table: `general_knowledge_mcqs`) — Generate 80 MCQs

**Subcategories to cover:**
- `'International Orgs'` — UN, OIC, SAARC, NATO, SCO, ECO, ASEAN, G7, G20 headquarters, SGs, members
- `'Capitals & Countries'` — Capital cities, country-continent matching
- `'Currencies'` — Currency of different countries
- `'World Geography'` — Largest/smallest/longest/highest in the world
- `'Science & Technology'` — Inventions, scientists, discoveries, space
- `'Current Affairs 2023-2025'` — World events, elections, conflicts, summits
- `'Sports'` — World Cups, Olympics, cricket, major events
- `'Important Dates'` — International days, historical world events
- `'Famous Personalities'` — World leaders, Nobel laureates, scientists

**Exam types to use:** `'KPPSC Planning Officer 2023'`, `'ETEA Police Constable 2024'`, `'CSS General Ability 2023'`, `'FPSC ASI 2023'`, `'FIA Inspector 2022'`, `'NTS Clerk 2023'`

**Pakistan-specific GK** (very important for KPPSC/ETEA):
- Districts of KPK and their headquarters
- Dams: Tarbela, Mangla, Warsak — rivers, capacity
- Pakistan's nuclear program milestones
- CPEC routes and ports

---

### 4. COMPUTER SCIENCE (Table: `computer_science_mcqs`) — Generate 50 MCQs

**Subcategories to cover:**
- `'Networking'` — OSI model, TCP/IP, protocols (HTTP, FTP, SMTP, DNS), IPv4/IPv6
- `'DBMS'` — Normalization, keys (Primary, Foreign, Candidate), SQL queries
- `'Operating Systems'` — Process management, memory management, file systems
- `'Data Structures'` — Arrays, stacks, queues, linked lists, trees, graphs
- `'Algorithms'` — Sorting (bubble, merge, quick), searching, Big O notation
- `'Programming Basics'` — OOP concepts (inheritance, polymorphism, encapsulation), loops
- `'MS Office'` — Word, Excel, PowerPoint shortcuts and features (very common in ETEA/KPPSC)
- `'Internet & Security'` — Cybersecurity basics, firewalls, encryption, malware types
- `'Computer Hardware'` — CPU, RAM, ROM, input/output devices, storage units

**Exam types to use:** `'ETEA Computer Operator 2024'`, `'KPPSC IT Officer 2023'`, `'ETEA IT Officer 2022'`, `'FPSC Computer Operator 2023'`, `'NTS Computer Operator 2022'`, `'FIA Sub-Inspector IT 2023'`

---

### 5. MATHEMATICS (Table: `mathematics_mcqs`) — Generate 50 MCQs

**Subcategories to cover:**
- `'Percentages'` — Profit, loss, discount, pass/fail calculations
- `'Ratios & Proportions'` — Direct/inverse proportion, worker-time problems
- `'Speed & Distance'` — Trains, cars, boats, relative speed
- `'Algebra'` — Linear equations, quadratic equations, simplification
- `'Averages'` — Consecutive numbers, weighted averages
- `'Geometry'` — Area, perimeter, volume (circles, triangles, rectangles, cubes)
- `'Number System'` — LCM, HCF, prime numbers, divisibility rules
- `'Time & Work'` — Pipe and cistern, combined work problems

**Exam types to use:** `'ETEA SST General 2024'`, `'KPPSC Tehsildar 2023'`, `'CSS General Ability 2022'`, `'FPSC Inspector 2023'`, `'ETEA Junior Clerk 2024'`, `'NTS 2023'`

**IMPORTANT:** Show the step-by-step solution in the `explanation` field. Students learn from the working.

---

### 6. ISLAMIAT (Table: `islamiat_mcqs`) — Generate 60 MCQs

**Subcategories to cover:**
- `'Holy Quran'` — Number of Surahs, Paras, Ayats, Makki/Madani Surahs, revelation details
- `'Hadith & Sunnah'` — Major Hadith collections, narrators, definitions
- `'Seerat-un-Nabi'` — Life of Prophet Muhammad (PBUH): dates, events, battles, wives
- `'Islamic History'` — Khulafa-e-Rashideen, Umayyads, Abbasids, major caliphs
- `'Fiqh & Pillars'` — Five Pillars of Islam, Zakaat rates, Hajj details, prayer times
- `'Quran Revelation'` — First/last revealed verses, important surahs and their topics
- `'Islamic Personalities'` — Companions of Prophet, scholars (Imam Abu Hanifa, Imam Shafi, Ghazali)
- `'Pakistan & Islam'` — Role of Islam in Pakistan constitution, Islamic provisions

**Exam types to use:** `'KPPSC Tehsildar 2023'`, `'ETEA SST Islamiat 2024'`, `'KPPSC PMS 2022'`, `'FPSC Islamiat Paper 2023'`, `'CSS Islamiat Optional 2022'`, `'NTS 2023'`

---

## EXAMPLE OF A GOOD MCQ (Follow this quality)

```sql
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
   'Which article of the 1973 Constitution of Pakistan declares Islam as the state religion?',
   '["Article 1","Article 2","Article 31","Article 62"]',
   1,
   'Article 2 of the 1973 Constitution explicitly declares: "Islam shall be the State Religion of Pakistan." Article 1 defines Pakistan as a Federal Republic. Article 31 deals with Islamic way of life. Article 62 sets qualifications for Members of Parliament.',
   'Constitution', 'KPPSC Tehsildar 2023', 'high', true, 8, 'high', true),
```

---

## OUTPUT FORMAT

Return a single `.sql` file with all 6 INSERT blocks in this order:
1. `english_mcqs` (60 MCQs)
2. `pakistan_studies_mcqs` (70 MCQs)
3. `general_knowledge_mcqs` (80 MCQs)
4. `computer_science_mcqs` (50 MCQs)
5. `mathematics_mcqs` (50 MCQs)
6. `islamiat_mcqs` (60 MCQs)

Each block must have its own `ON CONFLICT` clause at the end.

Start the file with:
```sql
-- ============================================================
-- Exam Topper — MCQ Seed Data (AI Generated Batch)
-- Run AFTER supabase_schema.sql in the Supabase SQL Editor
-- Total: ~370 MCQs across 6 subject tables
-- ============================================================
```

**DO NOT** include any explanations, markdown, or text outside the SQL. Return ONLY the SQL file content.
