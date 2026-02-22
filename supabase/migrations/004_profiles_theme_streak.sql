-- Tryb jasny/ciemny i ostatnia data aktywności (streak)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT CHECK (theme IN ('light', 'dark'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;
