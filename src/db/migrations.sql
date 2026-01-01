CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  bx NUMERIC DEFAULT 0,
  ref_by BIGINT
);

CREATE TABLE p2p_payments (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  amount_usd NUMERIC,
  reference TEXT UNIQUE,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sell_requests (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  bx_amount NUMERIC,
  usd_amount NUMERIC,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
