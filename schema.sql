CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  bx NUMERIC DEFAULT 0,
  last_mine INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  game TEXT,
  result TEXT,
  multiplier NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ton_withdrawals (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  ton NUMERIC,
  address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usdt_orders (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  provider TEXT,
  amount NUMERIC,
  proof TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Mining BNB / SOL (xv)
CREATE TABLE IF NOT EXISTS mining_external (
  user_id BIGINT,
  asset TEXT,               -- bnb | sol
  balance NUMERIC DEFAULT 0,
  last_mine INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, asset)
);
