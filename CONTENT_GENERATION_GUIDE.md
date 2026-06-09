# Content Generation Workflow — Exam Topper

How to use the 3 AI prompts to fill the app database with rich content.

---

## Step-by-Step Workflow

### For Each Content Type:

```
1. Open the prompt file (see below)
2. Copy the ENTIRE prompt file content
3. Paste it into your AI (ChatGPT / Claude / Gemini)
4. The AI will return a .sql file content
5. Save that content as the file name listed below
6. Send the .sql file back to me
7. I will review, validate, and run it in Supabase
```

---

## Phase 1 — MCQ Content (DO THIS FIRST — Most Important)

**Prompt file:** [AI_CONTENT_PROMPT_MCQs.md](file:///d:/smart-prep-mcqs/AI_CONTENT_PROMPT_MCQs.md)

**Save AI output as:** `supabase_seed_mcqs_batch1.sql`

**What you get:** ~370 MCQs across all 6 subjects
| Subject | Count |
|---|---|
| English | 60 MCQs |
| Pakistan Studies | 70 MCQs |
| General Knowledge | 80 MCQs |
| Computer Science | 50 MCQs |
| Mathematics | 50 MCQs |
| Islamiat | 60 MCQs |

> [!TIP]
> You can run the same prompt 2–3 times with different AIs and combine the outputs for more variety. Tell the AI: "Generate a DIFFERENT set of questions than the first batch."

---

## Phase 2 — Vocabulary Words

**Prompt file:** [AI_CONTENT_PROMPT_VOCAB.md](file:///d:/smart-prep-mcqs/AI_CONTENT_PROMPT_VOCAB.md)

**Save AI output as:** `supabase_seed_vocab_batch1.sql`

**What you get:** 100 new vocabulary words (IDs vocab-101 to vocab-200)

---

## Phase 3 — Study Notes

**Prompt file:** [AI_CONTENT_PROMPT_NOTES.md](file:///d:/smart-prep-mcqs/AI_CONTENT_PROMPT_NOTES.md)

**Save AI output as:** `supabase_seed_notes_batch1.sql`

**What you get:** 28 new structured study notes covering all 6 subjects

---

## After All 3 Phases — Run in This Order in Supabase:

```
1. supabase_schema.sql          ← (already done)
2. supabase_seed_data.sql       ← (already exists, run once)
3. supabase_seed_notes.sql      ← (already exists, run once)
4. supabase_seed_mcqs_batch1.sql   ← NEW (from AI)
5. supabase_seed_vocab_batch1.sql  ← NEW (from AI)
6. supabase_seed_notes_batch1.sql  ← NEW (from AI)
```

---

## Tips for Getting Good AI Output

1. **Use a strong AI** — Claude 3.5 Sonnet or GPT-4o gives the best SQL formatting. Gemini 1.5 Pro also works well.
2. **If output is cut off** — The AI may stop mid-way for very long outputs. Say "Continue from where you left off" to get the rest.
3. **Validate the SQL** — Before sending back to me, check:
   - Each MCQ row ends with `)` then `,` (except the last which has no comma)
   - `correct_answer` values are 0, 1, 2, or 3 (NOT A, B, C, D)
   - No apostrophes without double-escaping (`''` not `'`)
4. **Run batches** — If the AI refuses to generate 370 MCQs at once, split by subject: "Generate only the English MCQs" then "Generate only Pakistan Studies MCQs" etc.

---

## Content Target (Long Term)

| Subject | Current | After Phase 1 | Target |
|---|---|---|---|
| English | 4 | ~64 | 300+ |
| Pakistan Studies | 5 | ~75 | 500+ |
| General Knowledge | 4 | ~84 | 500+ |
| Computer Science | 5 | ~55 | 200+ |
| Mathematics | 5 | ~55 | 200+ |
| Islamiat | 0 | ~60 | 300+ |
| Vocab Words | 38 | ~138 | 500+ |
| Study Notes | 9 | ~37 | 100+ |
