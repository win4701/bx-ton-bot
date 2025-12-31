CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  bx NUMERIC DEFAULT 0,
  energy INT DEFAULT 5,
  daily_win NUMERIC DEFAULT 0,
  level INT DEFAULT 1,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_logs (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  game TEXT,
  bet NUMERIC,
  win NUMERIC,
  meta JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  bx_amount NUMERIC,
  ton_amount NUMERIC,
  tx_hash TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invites (
  code TEXT PRIMARY KEY,
  role TEXT DEFAULT 'influencer',
  max_uses INT,
  used INT DEFAULT 0,
  expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reserves (
  id SERIAL PRIMARY KEY,
  hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
