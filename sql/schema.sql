-- Users
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  bx NUMERIC DEFAULT 0
);

-- BX purchases
CREATE TABLE bx_purchases (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  method TEXT,
  amount_usdt NUMERIC,
  bx_amount NUMERIC,
  reference TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Games
CREATE TABLE game_bets (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  game TEXT,
  bet_bx NUMERIC,
  payout_bx NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tournaments
CREATE TABLE tournaments (
  id SERIAL PRIMARY KEY,
  name TEXT,
  prize_pool_bx NUMERIC,
  status TEXT
);

-- Mining
CREATE TABLE mining_accounts (
  user_id BIGINT PRIMARY KEY,
  plan TEXT,
  coin TEXT,
  balance NUMERIC DEFAULT 0
);
