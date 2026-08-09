-- Supabase Schema for WordPix Phase 5
-- Run this in the Supabase SQL Editor.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------
-- 1. PROFILES (Preferences & Progress)
-----------------------------------------------------------
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  preferences JSONB NOT NULL DEFAULT '{"englishLevel": "A1", "dailyGoalMinutes": 10, "goal": "everyday"}',
  accessibility JSONB NOT NULL DEFAULT '{"textSize": "standard", "highContrast": false, "speechRate": 0.75, "numeralSystem": "western", "includeSpeaking": true, "includeListening": true, "timedExercises": true, "autoAdvance": true}',
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  days_active INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  last_studied_date TEXT, -- Stored as "YYYY-MM-DD"
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-----------------------------------------------------------
-- 2. WORD MEMORY (SM-2 State)
-----------------------------------------------------------
CREATE TABLE word_memory (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, word_id)
);

ALTER TABLE word_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own word memory" 
ON word_memory FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own word memory" 
ON word_memory FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own word memory" 
ON word_memory FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own word memory" 
ON word_memory FOR DELETE 
USING (auth.uid() = user_id);

-----------------------------------------------------------
-- 3. SESSION HISTORY
-----------------------------------------------------------
CREATE TABLE session_history (
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL,
  score INTEGER NOT NULL,
  total_words INTEGER NOT NULL,
  xp_breakdown JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, session_id)
);

ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session history" 
ON session_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session history" 
ON session_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own session history" 
ON session_history FOR DELETE 
USING (auth.uid() = user_id);

-----------------------------------------------------------
-- 4. TRIGGERS (Auto-create profile)
-----------------------------------------------------------
-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
