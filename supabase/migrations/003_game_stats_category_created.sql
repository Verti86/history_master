-- category_id do progresu w działach; created_at do rankingu "ten tydzień" i streak
ALTER TABLE game_stats ADD COLUMN IF NOT EXISTS category_id TEXT;
ALTER TABLE game_stats ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
