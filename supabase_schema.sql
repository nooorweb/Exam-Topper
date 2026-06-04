-- ============================================================
-- Smart Prep MCQs — Production Supabase Schema
-- Run this entire file in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

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
  -- Denormalized stats (fast dashboard reads — never re-aggregate attempt_answers)
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
-- 2. mcqs (content table — shared, admin-seeded)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mcqs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question       TEXT NOT NULL,
  options        JSONB NOT NULL,                -- ["A", "B", "C", "D"]
  correct_answer SMALLINT NOT NULL,             -- 0-3
  explanation    TEXT,
  category       TEXT NOT NULL,
  subcategory    TEXT,
  exam_type      TEXT,
  difficulty     TEXT DEFAULT 'medium',         -- 'easy' | 'medium' | 'hard'
  is_repeated    BOOLEAN DEFAULT FALSE,
  repeat_count   SMALLINT DEFAULT 0,
  importance     TEXT DEFAULT 'medium',         -- 'high' | 'medium' | 'low'
  created_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mcqs_category   ON public.mcqs(category);
CREATE INDEX IF NOT EXISTS idx_mcqs_exam_type  ON public.mcqs(exam_type);
CREATE INDEX IF NOT EXISTS idx_mcqs_difficulty ON public.mcqs(difficulty);
CREATE INDEX IF NOT EXISTS idx_mcqs_is_public  ON public.mcqs(is_public);

-- ─────────────────────────────────────────────────────────────
-- 3. quiz_attempts (one row per completed quiz)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category         TEXT NOT NULL,
  exam_type        TEXT,
  started_at       TIMESTAMPTZ NOT NULL,
  completed_at     TIMESTAMPTZ NOT NULL,
  time_spent_secs  INT NOT NULL,
  total_questions  SMALLINT NOT NULL,
  correct_count    SMALLINT NOT NULL,
  score_percent    NUMERIC(5,2) NOT NULL,
  difficulty       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user     ON public.quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_category ON public.quiz_attempts(user_id, category);

-- ─────────────────────────────────────────────────────────────
-- 4. attempt_answers (per-question detail — separate from attempts)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mcq_id          UUID REFERENCES public.mcqs(id) ON DELETE SET NULL,
  category        TEXT NOT NULL,
  selected_option SMALLINT,
  correct_option  SMALLINT NOT NULL,
  is_correct      BOOLEAN NOT NULL,
  time_spent_secs INT DEFAULT 0
);

-- Partial index: only indexes incorrect answers (cheap for weak-area queries)
CREATE INDEX IF NOT EXISTS idx_answers_user_wrong ON public.attempt_answers(user_id, category)
  WHERE is_correct = FALSE;
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON public.attempt_answers(attempt_id);

-- ─────────────────────────────────────────────────────────────
-- 5. weak_areas (pre-aggregated summary — avoids re-scanning attempt_answers)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weak_areas (
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  incorrect_count INT DEFAULT 0,
  total_count     INT DEFAULT 0,
  accuracy_pct    NUMERIC(5,2) DEFAULT 0,
  last_updated    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, category)
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
-- 7. Row-Level Security (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weak_areas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_streaks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcqs             ENABLE ROW LEVEL SECURITY;

-- user_profiles: own data only
DROP POLICY IF EXISTS "Users own their profile" ON public.user_profiles;
CREATE POLICY "Users own their profile" ON public.user_profiles
  FOR ALL USING (auth.uid() = id);

-- quiz_attempts: own data only
DROP POLICY IF EXISTS "Users own their attempts" ON public.quiz_attempts;
CREATE POLICY "Users own their attempts" ON public.quiz_attempts
  FOR ALL USING (auth.uid() = user_id);

-- attempt_answers: own data only
DROP POLICY IF EXISTS "Users own their answers" ON public.attempt_answers;
CREATE POLICY "Users own their answers" ON public.attempt_answers
  FOR ALL USING (auth.uid() = user_id);

-- weak_areas: own data only
DROP POLICY IF EXISTS "Users own their weak areas" ON public.weak_areas;
CREATE POLICY "Users own their weak areas" ON public.weak_areas
  FOR ALL USING (auth.uid() = user_id);

-- daily_streaks: own data only
DROP POLICY IF EXISTS "Users own their streaks" ON public.daily_streaks;
CREATE POLICY "Users own their streaks" ON public.daily_streaks
  FOR ALL USING (auth.uid() = user_id);

-- mcqs: everyone can read public MCQs
DROP POLICY IF EXISTS "Public MCQs are readable" ON public.mcqs;
CREATE POLICY "Public MCQs are readable" ON public.mcqs
  FOR SELECT USING (is_public = TRUE);

-- mcqs: creators can manage their own
DROP POLICY IF EXISTS "Creators manage their MCQs" ON public.mcqs;
CREATE POLICY "Creators manage their MCQs" ON public.mcqs
  FOR ALL USING (auth.uid() = created_by);

-- ─────────────────────────────────────────────────────────────
-- 8. Atomic stat-increment RPC (avoids read-modify-write race conditions)
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
    v_streak := 1;   -- Gap in days — reset streak
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
-- Done! Verify tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- ─────────────────────────────────────────────────────────────
