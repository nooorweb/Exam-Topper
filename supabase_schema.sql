-- ============================================================
-- Smart Prep MCQs — REVISED Schema
-- Subject-specific MCQ tables (one per subject) + shared vocab/notes
-- Run this ENTIRE file in the Supabase SQL Editor
-- ============================================================

-- DROP old and new tables to ensure a clean, optimized schema re-creation
DROP TABLE IF EXISTS public.mcqs CASCADE;
DROP TABLE IF EXISTS public.english_mcqs CASCADE;
DROP TABLE IF EXISTS public.pakistan_studies_mcqs CASCADE;
DROP TABLE IF EXISTS public.general_knowledge_mcqs CASCADE;
DROP TABLE IF EXISTS public.computer_science_mcqs CASCADE;
DROP TABLE IF EXISTS public.mathematics_mcqs CASCADE;
DROP TABLE IF EXISTS public.islamiat_mcqs CASCADE;
DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.weak_areas CASCADE;
DROP TABLE IF EXISTS public.daily_streaks CASCADE;
DROP TABLE IF EXISTS public.user_vocab_bookmarks CASCADE;
DROP TABLE IF EXISTS public.vocab_words CASCADE;
DROP TABLE IF EXISTS public.note_topics CASCADE;

-- ─────────────────────────────────────────────────────────────
-- 1. user_profiles
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name             TEXT,
  avatar_url               TEXT,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  -- Onboarding
  onboarding_done          BOOLEAN DEFAULT FALSE,
  selected_subjects        TEXT[]  DEFAULT '{}',
  exam_target              TEXT,
  daily_goal_minutes       INT DEFAULT 20,
  -- Denormalized stats (fast dashboard reads)
  total_questions_answered INT DEFAULT 0,
  correct_answers_count    INT DEFAULT 0,
  current_streak           INT DEFAULT 0,
  longest_streak           INT DEFAULT 0,
  last_active_date         DATE,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile row on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. SUBJECTS MCQ TABLES (one per subject)
-- Shared columns across all subject MCQ tables:
--   id, question, options (JSONB), correct_answer, explanation,
--   subcategory, exam_type, difficulty, is_repeated, repeat_count,
--   importance, is_public, created_at
-- ─────────────────────────────────────────────────────────────

-- 2a. english_mcqs
CREATE TABLE IF NOT EXISTS public.english_mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,              -- ["A","B","C","D"]
  correct_answer SMALLINT NOT NULL,           -- 0-3
  explanation    TEXT,
  subcategory    TEXT,                        -- e.g. "Grammar","Vocabulary","Idioms"
  exam_type      TEXT,                        -- e.g. "KPPSC 2022"
  difficulty     TEXT DEFAULT 'medium',
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_english_mcqs_difficulty  ON public.english_mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_english_mcqs_importance  ON public.english_mcqs(importance);
CREATE INDEX IF NOT EXISTS idx_english_mcqs_exam_type   ON public.english_mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_english_mcqs_is_public   ON public.english_mcqs(is_public);

-- 2b. pakistan_studies_mcqs
CREATE TABLE IF NOT EXISTS public.pakistan_studies_mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,
  correct_answer SMALLINT NOT NULL,
  explanation    TEXT,
  subcategory    TEXT,
  exam_type      TEXT,
  difficulty     TEXT DEFAULT 'medium',
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ps_mcqs_difficulty ON public.pakistan_studies_mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_ps_mcqs_importance ON public.pakistan_studies_mcqs(importance);
CREATE INDEX IF NOT EXISTS idx_ps_mcqs_exam_type  ON public.pakistan_studies_mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_ps_mcqs_is_public  ON public.pakistan_studies_mcqs(is_public);

-- 2c. general_knowledge_mcqs
CREATE TABLE IF NOT EXISTS public.general_knowledge_mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,
  correct_answer SMALLINT NOT NULL,
  explanation    TEXT,
  subcategory    TEXT,
  exam_type      TEXT,
  difficulty     TEXT DEFAULT 'medium',
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gk_mcqs_difficulty ON public.general_knowledge_mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_gk_mcqs_importance ON public.general_knowledge_mcqs(importance);
CREATE INDEX IF NOT EXISTS idx_gk_mcqs_exam_type  ON public.general_knowledge_mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_gk_mcqs_is_public  ON public.general_knowledge_mcqs(is_public);

-- 2d. computer_science_mcqs
CREATE TABLE IF NOT EXISTS public.computer_science_mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,
  correct_answer SMALLINT NOT NULL,
  explanation    TEXT,
  subcategory    TEXT,
  exam_type      TEXT,
  difficulty     TEXT DEFAULT 'medium',
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cs_mcqs_difficulty ON public.computer_science_mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_cs_mcqs_importance ON public.computer_science_mcqs(importance);
CREATE INDEX IF NOT EXISTS idx_cs_mcqs_exam_type  ON public.computer_science_mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_cs_mcqs_is_public  ON public.computer_science_mcqs(is_public);

-- 2e. mathematics_mcqs
CREATE TABLE IF NOT EXISTS public.mathematics_mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,
  correct_answer SMALLINT NOT NULL,
  explanation    TEXT,
  subcategory    TEXT,
  exam_type      TEXT,
  difficulty     TEXT DEFAULT 'medium',
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_math_mcqs_difficulty ON public.mathematics_mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_math_mcqs_importance ON public.mathematics_mcqs(importance);
CREATE INDEX IF NOT EXISTS idx_math_mcqs_exam_type  ON public.mathematics_mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_math_mcqs_is_public  ON public.mathematics_mcqs(is_public);

-- 2f. islamiat_mcqs
CREATE TABLE IF NOT EXISTS public.islamiat_mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,
  correct_answer SMALLINT NOT NULL,
  explanation    TEXT,
  subcategory    TEXT,
  exam_type      TEXT,
  difficulty     TEXT DEFAULT 'medium',
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_islamiat_mcqs_difficulty ON public.islamiat_mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_islamiat_mcqs_importance ON public.islamiat_mcqs(importance);
CREATE INDEX IF NOT EXISTS idx_islamiat_mcqs_exam_type  ON public.islamiat_mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_islamiat_mcqs_is_public  ON public.islamiat_mcqs(is_public);

-- ─────────────────────────────────────────────────────────────
-- 3. quiz_attempts (one row per completed quiz)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject          TEXT NOT NULL,   -- e.g. "English", "Mathematics"
  exam_type        TEXT,
  started_at       TIMESTAMPTZ NOT NULL,
  completed_at     TIMESTAMPTZ NOT NULL,
  time_spent_secs  INT NOT NULL,
  total_questions  SMALLINT NOT NULL,
  correct_count    SMALLINT NOT NULL,
  score_percent    NUMERIC(5,2) NOT NULL,
  difficulty       TEXT,
  answers_summary  JSONB DEFAULT '[]', -- [{"m":"<mcq_id>","s":1,"c":1,"t":5}]
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user     ON public.quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_subject  ON public.quiz_attempts(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_attempts_user_date ON public.quiz_attempts(user_id, completed_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 4. [DEPRECATED] attempt_answers (removed for storage optimization)
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- 5. weak_areas (pre-aggregated summary)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weak_areas (
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL,
  incorrect_count INT DEFAULT 0,
  total_count     INT DEFAULT 0,
  accuracy_pct    NUMERIC(5,2) DEFAULT 0,
  last_updated    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_weak_areas_user ON public.weak_areas(user_id, accuracy_pct ASC);

-- ─────────────────────────────────────────────────────────────
-- 6. daily_streaks (calendar log)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_streaks (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_date DATE NOT NULL,
  PRIMARY KEY (user_id, streak_date)
);

CREATE INDEX IF NOT EXISTS idx_streaks_user ON public.daily_streaks(user_id, streak_date DESC);

-- ─────────────────────────────────────────────────────────────
-- 7. vocab_words (shared content — all subjects)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vocab_words (
  id            TEXT PRIMARY KEY,
  word          TEXT NOT NULL,
  meaning       TEXT NOT NULL,
  urdu_meaning  TEXT,
  synonyms      JSONB NOT NULL DEFAULT '[]',
  antonyms      JSONB NOT NULL DEFAULT '[]',
  example       TEXT NOT NULL DEFAULT '',
  category      TEXT DEFAULT 'General Vocabulary',
  is_public     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocab_category  ON public.vocab_words(category);
CREATE INDEX IF NOT EXISTS idx_vocab_is_public ON public.vocab_words(is_public);

-- ─────────────────────────────────────────────────────────────
-- 8. user_vocab_bookmarks (per-user bookmarks in cloud)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_vocab_bookmarks (
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id      TEXT NOT NULL REFERENCES public.vocab_words(id) ON DELETE CASCADE,
  bookmarked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, vocab_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.user_vocab_bookmarks(user_id);

-- ─────────────────────────────────────────────────────────────
-- 9. note_topics (study notes — shared content)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.note_topics (
  id                  TEXT PRIMARY KEY,
  subject             TEXT NOT NULL,
  title               TEXT NOT NULL,
  overview            TEXT NOT NULL DEFAULT '',
  content             TEXT NOT NULL DEFAULT '',
  key_points          JSONB NOT NULL DEFAULT '[]',
  formulas            JSONB DEFAULT NULL,
  tables_data         JSONB DEFAULT NULL,
  exam_targets        JSONB NOT NULL DEFAULT '[]',
  importance          TEXT DEFAULT 'medium',
  estimated_read_time INT DEFAULT 5,
  is_public           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_note_topics_subject   ON public.note_topics(subject);
CREATE INDEX IF NOT EXISTS idx_note_topics_is_public ON public.note_topics(is_public);

-- ─────────────────────────────────────────────────────────────
-- 10. Row-Level Security (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weak_areas             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_streaks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_words            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocab_bookmarks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_topics            ENABLE ROW LEVEL SECURITY;
-- Subject MCQ tables
ALTER TABLE public.english_mcqs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pakistan_studies_mcqs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_knowledge_mcqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.computer_science_mcqs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mathematics_mcqs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islamiat_mcqs          ENABLE ROW LEVEL SECURITY;

-- user_profiles: own data only
DROP POLICY IF EXISTS "Users own their profile" ON public.user_profiles;
CREATE POLICY "Users own their profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

-- quiz_attempts: own data only
DROP POLICY IF EXISTS "Users own their attempts" ON public.quiz_attempts;
CREATE POLICY "Users own their attempts" ON public.quiz_attempts
  FOR ALL USING (auth.uid() = user_id);

-- weak_areas: own data only
DROP POLICY IF EXISTS "Users own their weak areas" ON public.weak_areas;
CREATE POLICY "Users own their weak areas" ON public.weak_areas
  FOR ALL USING (auth.uid() = user_id);

-- daily_streaks: own data only
DROP POLICY IF EXISTS "Users own their streaks" ON public.daily_streaks;
CREATE POLICY "Users own their streaks" ON public.daily_streaks
  FOR ALL USING (auth.uid() = user_id);

-- vocab_words: public read
DROP POLICY IF EXISTS "Public vocab readable" ON public.vocab_words;
CREATE POLICY "Public vocab readable" ON public.vocab_words
  FOR SELECT USING (is_public = TRUE);

-- user_vocab_bookmarks: own data only
DROP POLICY IF EXISTS "Users own their bookmarks" ON public.user_vocab_bookmarks;
CREATE POLICY "Users own their bookmarks" ON public.user_vocab_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- note_topics: public read
DROP POLICY IF EXISTS "Public notes readable" ON public.note_topics;
CREATE POLICY "Public notes readable" ON public.note_topics
  FOR SELECT USING (is_public = TRUE);

-- Subject MCQ tables: public read
DROP POLICY IF EXISTS "Public english MCQs readable" ON public.english_mcqs;
CREATE POLICY "Public english MCQs readable" ON public.english_mcqs
  FOR SELECT USING (is_public = TRUE);

DROP POLICY IF EXISTS "Public pakistan studies MCQs readable" ON public.pakistan_studies_mcqs;
CREATE POLICY "Public pakistan studies MCQs readable" ON public.pakistan_studies_mcqs
  FOR SELECT USING (is_public = TRUE);

DROP POLICY IF EXISTS "Public GK MCQs readable" ON public.general_knowledge_mcqs;
CREATE POLICY "Public GK MCQs readable" ON public.general_knowledge_mcqs
  FOR SELECT USING (is_public = TRUE);

DROP POLICY IF EXISTS "Public CS MCQs readable" ON public.computer_science_mcqs;
CREATE POLICY "Public CS MCQs readable" ON public.computer_science_mcqs
  FOR SELECT USING (is_public = TRUE);

DROP POLICY IF EXISTS "Public math MCQs readable" ON public.mathematics_mcqs;
CREATE POLICY "Public math MCQs readable" ON public.mathematics_mcqs
  FOR SELECT USING (is_public = TRUE);

DROP POLICY IF EXISTS "Public islamiat MCQs readable" ON public.islamiat_mcqs;
CREATE POLICY "Public islamiat MCQs readable" ON public.islamiat_mcqs
  FOR SELECT USING (is_public = TRUE);

-- ─────────────────────────────────────────────────────────────
-- 11. Atomic stat-increment RPC
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_user_stats(
  p_user_id    UUID,
  p_questions  INT,
  p_correct    INT,
  p_streak_date DATE
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_last_date  DATE;
  v_streak     INT;
  v_longest    INT;
BEGIN
  SELECT last_active_date, current_streak, longest_streak
    INTO v_last_date, v_streak, v_longest
  FROM public.user_profiles WHERE id = p_user_id;

  -- Streak logic
  IF v_last_date IS NULL THEN
    v_streak := 1;
  ELSIF p_streak_date > v_last_date + INTERVAL '1 day' THEN
    v_streak := 1;   -- Gap — reset streak
  ELSIF p_streak_date = v_last_date + INTERVAL '1 day' THEN
    v_streak := v_streak + 1;   -- Consecutive day
  END IF;
  -- Same day: leave streak unchanged

  v_longest := GREATEST(COALESCE(v_longest, 0), v_streak);

  UPDATE public.user_profiles SET
    total_questions_answered = total_questions_answered + p_questions,
    correct_answers_count    = correct_answers_count + p_correct,
    current_streak           = v_streak,
    longest_streak           = v_longest,
    last_active_date         = p_streak_date,
    updated_at               = NOW()
  WHERE id = p_user_id;

  -- Log to daily_streaks calendar
  INSERT INTO public.daily_streaks (user_id, streak_date)
  VALUES (p_user_id, p_streak_date)
  ON CONFLICT DO NOTHING;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- 12. Accumulating weak areas RPC
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.upsert_weak_area(
  p_user_id UUID, p_subject TEXT, p_incorrect INT, p_total INT
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.weak_areas (user_id, subject, incorrect_count, total_count, accuracy_pct)
  VALUES (
    p_user_id,
    p_subject,
    p_incorrect,
    p_total,
    ROUND((GREATEST(0, p_total - p_incorrect)::NUMERIC / NULLIF(p_total, 0)) * 100, 2)
  )
  ON CONFLICT (user_id, subject) DO UPDATE SET
    incorrect_count = weak_areas.incorrect_count + EXCLUDED.incorrect_count,
    total_count     = weak_areas.total_count     + EXCLUDED.total_count,
    accuracy_pct    = ROUND((GREATEST(0, (weak_areas.total_count + EXCLUDED.total_count - 
                              weak_areas.incorrect_count - EXCLUDED.incorrect_count))::NUMERIC /
                             NULLIF(weak_areas.total_count + EXCLUDED.total_count, 0)) * 100, 2),
    last_updated    = NOW();
END; $$;

-- ─────────────────────────────────────────────────────────────
-- 13. Optimized Indexes for Query Performance
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_english_exam_diff ON public.english_mcqs(exam_type, difficulty) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_ps_exam_diff ON public.pakistan_studies_mcqs(exam_type, difficulty) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_gk_exam_diff ON public.general_knowledge_mcqs(exam_type, difficulty) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_cs_exam_diff ON public.computer_science_mcqs(exam_type, difficulty) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_math_exam_diff ON public.mathematics_mcqs(exam_type, difficulty) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_islamiat_exam_diff ON public.islamiat_mcqs(exam_type, difficulty) WHERE is_public = TRUE;

CREATE INDEX IF NOT EXISTS idx_vocab_cat_pub ON public.vocab_words(category, is_public);

-- ─────────────────────────────────────────────────────────────
-- Done! Verify tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- Expected: computer_science_mcqs, daily_streaks, english_mcqs,
--           general_knowledge_mcqs, islamiat_mcqs, mathematics_mcqs, note_topics,
--           pakistan_studies_mcqs, quiz_attempts, user_profiles, user_vocab_bookmarks,
--           vocab_words, weak_areas
-- ─────────────────────────────────────────────────────────────
