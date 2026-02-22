-- Odznaki (achievements) – odblokowane przez użytkownika
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_achievements_select_own"
  ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_achievements_insert_own"
  ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
