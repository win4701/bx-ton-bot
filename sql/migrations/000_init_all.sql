/* ============================================================
   Bloxio BX – Full Database Initialization
   File: 000_init_all.sql
   Safe to run multiple times (IF NOT EXISTS)
   ============================================================ */

BEGIN;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,             -- Telegram user id
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BX PURCHASES (Buy BX via TON / USDT)
-- ============================================================
CREATE TABLE IF NOT EXISTS bx_purchases (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  method TEXT NOT NULL,              -- ton | binance | redotpay
  amount_usdt NUMERIC,
  amount_ton NUMERIC,
  bx_amount NUMERIC NOT NULL,
  reference TEXT UNIQUE,             -- memo / txid
  status TEXT DEFAULT 'pending',     -- pending | approved | rejected
  user_ton_address TEXT,             -- where BX is sent
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bx_purchases_status
ON bx_purchases(status);

CREATE INDEX IF NOT EXISTS idx_bx_purchases_created_at
ON bx_purchases(created_at);

-- ============================================================
-- ADMIN LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,              -- APPROVE_BUY / REJECT_BUY
  ref_id INT,                        -- bx_purchases.id
  admin_id BIGINT NOT NULL,          -- Telegram admin id
  ip TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action
ON admin_logs(action);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at
ON admin_logs(created_at);

-- ============================================================
-- INVITE / INFLUENCERS
-- ============================================================
CREATE TABLE IF NOT EXISTS influencers (
  id SERIAL PRIMARY KEY,
  name TEXT,
  code TEXT UNIQUE,
  max_users INT DEFAULT 500,
  max_daily_usdt NUMERIC DEFAULT 10000,
  commission_rate NUMERIC DEFAULT 0.05,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- MINING (Cloud Mining)
-- ============================================================
CREATE TABLE IF NOT EXISTS mining_plans (
  plan TEXT PRIMARY KEY,             -- free | silver | gold
  daily_rate NUMERIC NOT NULL,
  withdraw_min NUMERIC NOT NULL,
  cooldown_hours INT NOT NULL
);

CREATE TABLE IF NOT EXISTS mining_accounts (
  user_id BIGINT PRIMARY KEY REFERENCES users(id),
  plan TEXT REFERENCES mining_plans(plan),
  coin TEXT,                         -- BNB | SOL
  balance NUMERIC DEFAULT 0,
  last_mine TIMESTAMP,
  last_withdraw TIMESTAMP,
  boost NUMERIC DEFAULT 0
);

-- Default mining plans
INSERT INTO mining_plans (plan, daily_rate, withdraw_min, cooldown_hours)
VALUES
  ('free',   0.002,
