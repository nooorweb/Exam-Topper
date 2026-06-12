-- ============================================================
-- Exam Topper — Note Topic MCQs Schema Addition
-- Run this in the Supabase SQL Editor AFTER supabase_schema.sql
-- Adds a new dedicated table for note-linked MCQs
-- ============================================================

-- Drop if re-running
DROP TABLE IF EXISTS public.note_topic_mcqs CASCADE;

-- ─────────────────────────────────────────────────────────────
-- note_topic_mcqs
-- One row per MCQ, each linked to a specific note topic.
-- note_topic_id matches the 'id' column in note_topics table.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.note_topic_mcqs (
  id             TEXT PRIMARY KEY,              -- human-readable, e.g. 'psn1-q1'
  note_topic_id  TEXT NOT NULL,                 -- FK → note_topics.id (e.g. 'ps-note-1')
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,                -- ["A","B","C","D"]
  correct_answer SMALLINT NOT NULL,             -- 0-3
  explanation    TEXT,
  category       TEXT NOT NULL,                 -- e.g. 'Pakistan Studies'
  sort_order     SMALLINT DEFAULT 0,            -- ordering within a topic
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast topic-based lookup
CREATE INDEX IF NOT EXISTS idx_note_mcqs_topic_id ON public.note_topic_mcqs(note_topic_id);
CREATE INDEX IF NOT EXISTS idx_note_mcqs_is_public ON public.note_topic_mcqs(is_public);
CREATE INDEX IF NOT EXISTS idx_note_mcqs_topic_pub ON public.note_topic_mcqs(note_topic_id, is_public);

-- Row-Level Security
ALTER TABLE public.note_topic_mcqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public note MCQs readable" ON public.note_topic_mcqs;
CREATE POLICY "Public note MCQs readable" ON public.note_topic_mcqs
  FOR SELECT USING (is_public = TRUE);
