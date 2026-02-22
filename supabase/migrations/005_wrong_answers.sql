-- Pytania pomylone w quizie – tryb "powtórka słabych stron"
CREATE TABLE IF NOT EXISTS quiz_wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  times_wrong INT NOT NULL DEFAULT 1,
  last_wrong_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, question_text)
);

CREATE INDEX IF NOT EXISTS idx_quiz_wrong_user ON quiz_wrong_answers(user_id);
ALTER TABLE quiz_wrong_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_wrong_select_own"
  ON quiz_wrong_answers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "quiz_wrong_insert_own"
  ON quiz_wrong_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quiz_wrong_update_own"
  ON quiz_wrong_answers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "quiz_wrong_delete_own"
  ON quiz_wrong_answers FOR DELETE TO authenticated USING (auth.uid() = user_id);
