-- =========================
-- Bloxio BX Database Schema
-- =========================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  bx_balance NUMERIC(36, 9) DEFAULT 0,
  ref_by BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  type TEXT CHECK (type IN ('buy', 'sell', 'reward', 'game')),
  asset TEXT CHECK (asset IN ('TON', 'USDT', 'BX')),
  amount NUMERIC(36, 9),
  status TEXT DEFAULT 'pending',
  proof TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  game TEXT CHECK (game IN ('crash', 'chicken', 'dice')),
  bet NUMERIC(36, 9),
  payout NUMERIC(36, 9),
  result TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id SERIAL PRIMARY KEY,
  admin_id BIGINT,
  action TEXT CHECK (action IN ('approve', 'reject')),
  tx_id INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_tx_telegram_id ON transactions(telegram_id);
