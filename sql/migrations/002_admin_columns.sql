/* ============================================================
   Migration: Admin columns + logs
   File: 002_admin_columns.sql
   Safe to run multiple times (IF NOT EXISTS)
   ============================================================ */

BEGIN;

-- ------------------------------------------------------------
-- bx_purchases: add admin-related columns
-- ------------------------------------------------------------
ALTER TABLE bx_purchases
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS user_ton_address TEXT;

-- Optional: index for faster admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_bx_purchases_status
ON bx_purchases(status);

CREATE INDEX IF NOT EXISTS idx_bx_purchases_approved_at
ON bx_purchases(approved_at);

-- ------------------------------------------------------------
-- admin_logs: track admin actions (approve / reject / overrides)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,              -- e.g. APPROVE_BUY, REJECT_BUY
  ref_id INT,                        -- reference to bx_purchases.id
  admin_id BIGINT NOT NULL,          -- Telegram admin id
  ip TEXT,                           -- optional: request IP
  created_at TIMESTAMP DEFAULT NOW()
);

-- Optional index for logs filtering
CREATE INDEX IF NOT EXISTS idx_admin_logs_action
ON admin_logs(action);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at
ON admin_logs(created_at);

COMMIT;
