-- supabase/migrations/20250525173253_update_qna_question_timestamp.sql

-- 1. Add updated_at column to qna_questions table
ALTER TABLE public.qna_questions
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Initialize existing rows' updated_at to their created_at value
UPDATE public.qna_questions
SET updated_at = created_at
WHERE updated_at IS NULL;

-- Ensure updated_at is NOT NULL after initialization if desired, or allow NULL if some questions might never be updated.
-- For consistency with created_at, let's make it NOT NULL.
ALTER TABLE public.qna_questions
  ALTER COLUMN updated_at SET NOT NULL;

-- 2. Create the function to update qna_questions.updated_at
CREATE OR REPLACE FUNCTION public.update_question_updated_at_on_new_answer()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.qna_questions
  SET updated_at = NOW()
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the trigger on qna_answers
CREATE TRIGGER on_new_qna_answer_update_question_timestamp
  AFTER INSERT ON public.qna_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_question_updated_at_on_new_answer();

-- 4. Add an index on the new updated_at column for qna_questions
CREATE INDEX IF NOT EXISTS idx_qna_questions_updated_at ON public.qna_questions(updated_at);
