# MASTER PROMPT — Vocabulary Words Content Generation for Exam Topper App
# Give this entire document to your AI (e.g. ChatGPT, Claude, Gemini)
# The AI must return a .sql file you can paste directly into Supabase SQL Editor

---

## CONTEXT

You are generating vocabulary word seed data for a Pakistani competitive exam preparation app called "Exam Topper". The vocab section teaches students high-yield English vocabulary words that appear in KPPSC, ETEA, FPSC, CSS, PMS, FIA, and NTS exams.

---

## CRITICAL RULES

1. **id** must be a unique short string like `'vocab-101'`, `'vocab-102'`, ... (continue from 101 onwards to avoid conflict with existing 1–38)
2. **word** — The vocabulary word in English (Title Case)
3. **meaning** — Clear, exam-focused definition in English
4. **urdu_meaning** — Urdu translation with Roman Urdu transliteration in parenthesis. Format: `'اردو معنی (Roman Urdu)'`
5. **synonyms** — JSON array of 3–5 English synonyms. Format: `'["syn1","syn2","syn3"]'`
6. **antonyms** — JSON array of 3–5 English antonyms. Format: `'["ant1","ant2","ant3"]'`
7. **example** — A sentence using the word in a Pakistani exam/governance/civil service context
8. **category** — Use ONLY these values: `'CSS Vocab'`, `'KPPSC Vocab'`, `'ETEA Vocab'`, `'FPSC Vocab'`, `'General Vocabulary'`, `'Exam Acronym'`
9. **is_public** — Always `true`
10. **Apostrophes** inside strings — escape with `''` (double single quote)
11. **Generate 100 words minimum** — covering all category types

---

## EXISTING WORDS (DO NOT REPEAT THESE)

The following words already exist in the database. Do not add them again:
Pragmatic, Anachronism, Ameliorate, Obfuscate, Capricious, Fastidious, Ephemeral, Abstain, CPEC, FATF, KPPSC, ETEA, CSS, Aberration, Abnegation, Alacrity, Anomalous, Assiduous, Bellicose, Cacophony, Clemency, Cogent, Conundrum, Dearth, Decorum, Ebullient, Enervate, Equivocal, Esoteric, Exculpate, Garrulous, Harangue, Iconoclast, Implacable, Incipient, Intrepid, Laconic, Mendacious, Nefarious, Obdurate, Pervasive, Sycophant, Ubiquitous

---

## DATABASE SCHEMA

**Table: `public.vocab_words`**

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PRIMARY KEY | Short string like `'vocab-101'` |
| `word` | TEXT | The English word |
| `meaning` | TEXT | English definition |
| `urdu_meaning` | TEXT | Urdu + Roman Urdu |
| `synonyms` | JSONB | JSON array of strings |
| `antonyms` | JSONB | JSON array of strings |
| `example` | TEXT | Sentence using the word |
| `category` | TEXT | See category list above |
| `is_public` | BOOLEAN | Always true |

---

## EXACT SQL FORMAT TO FOLLOW

```sql
INSERT INTO public.vocab_words (id, word, meaning, urdu_meaning, synonyms, antonyms, example, category, is_public)
VALUES
  ('vocab-101',
   'Acrimonious',
   'Angry and bitter, especially in speech or manner.',
   'تلخ / کڑوا / طیش آلود (Talkh / Karwa / Tayash-aalood)',
   '["bitter","hostile","caustic","vitriolic"]',
   '["amicable","cordial","pleasant","harmonious"]',
   'The acrimonious debate in the provincial assembly delayed the new education bill by three months.',
   'CSS Vocab', true),

  ('vocab-102',
   'Admonish',
   'To warn or reprimand someone firmly.',
   'ڈانٹنا / سرزنش کرنا (Dantna / Sarzanish karna)',
   '["reprimand","rebuke","scold","chastise"]',
   '["praise","commend","approve","laud"]',
   'The KPPSC examiner admonished candidates caught using unfair means during the screening test.',
   'KPPSC Vocab', true)

ON CONFLICT (id) DO UPDATE SET
  word         = EXCLUDED.word,
  meaning      = EXCLUDED.meaning,
  urdu_meaning = EXCLUDED.urdu_meaning,
  synonyms     = EXCLUDED.synonyms,
  antonyms     = EXCLUDED.antonyms,
  example      = EXCLUDED.example,
  category     = EXCLUDED.category,
  is_public    = EXCLUDED.is_public;
```

---

## CONTENT REQUIREMENTS

### Distribution of categories (for 100 words):
- `'CSS Vocab'` — 35 words (highest level; used in CSS/PMS exams)
- `'KPPSC Vocab'` — 25 words (provincial level; medium-hard)
- `'FPSC Vocab'` — 20 words (federal service level)
- `'General Vocabulary'` — 15 words (common competitive exam words)
- `'ETEA Vocab'` — 5 words (simpler, KPK testing authority)

### Example high-value words to include (but don't limit to these):
**CSS Level:** Pejorative, Recalcitrant, Truculent, Pusillanimous, Inveterate, Malfeasance, Perfidious, Supercilious, Turpitude, Vituperate, Inimical, Insolent, Litigious, Temerity, Avarice, Propitious, Sanguine, Torpor, Umbrage, Veracious, Ostentatious, Ignominious, Repudiate, Obsequious, Recondite

**KPPSC Level:** Appease, Acumen, Candid, Compliant, Connive, Corroborate, Delude, Denounce, Destitute, Discrepancy, Elude, Empower, Entrust, Exacerbate, Expedite, Grievance, Hinder, Impede, Impartial, Mandate

**FPSC Level:** Abdicate, Acquiesce, Ambivalent, Audacious, Capitulate, Censure, Coerce, Compel, Connivance, Contrition, Culpable, Defiant, Deference, Duplicity, Embargo, Fervent, Flagrant, Impunity, Lament, Magnanimous

---

## QUALITY STANDARD

Each `example` sentence MUST:
- Reference a Pakistani context (KPPSC exam, government office, district administration, FIA, police, CSS interview, etc.)
- Be a complete, grammatically perfect sentence
- Naturally demonstrate the word's meaning in context

Example of a GOOD example sentence:
> "The district commissioner's acrimonious remarks during the press conference drew sharp criticism from civil society groups."

Example of a BAD example sentence (too generic):
> "The politician was acrimonious in his speech."

---

## OUTPUT FORMAT

Return a single `.sql` file. Start with:
```sql
-- ============================================================
-- Exam Topper — Vocabulary Words Seed Data (AI Generated Batch)
-- Run AFTER supabase_schema.sql in the Supabase SQL Editor
-- IDs: vocab-101 to vocab-200 (100 words)
-- ============================================================
```

**Return ONLY the SQL. No explanations, no markdown outside the SQL.**
