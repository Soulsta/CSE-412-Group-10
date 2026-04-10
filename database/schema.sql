CREATE TABLE IF NOT EXISTS student (
  asurite   TEXT PRIMARY KEY,
  email     TEXT UNIQUE NOT NULL,
  password  TEXT NOT NULL,
  eligible  BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS athleticadministrator (
  staffId       SERIAL PRIMARY KEY,
  staffEmail    TEXT UNIQUE NOT NULL,
  staffPassword TEXT NOT NULL,
  staffRole     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);