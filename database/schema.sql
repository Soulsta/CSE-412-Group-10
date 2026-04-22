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

CREATE TABLE IF NOT EXISTS Category (
  categoryType VARCHAR(100) PRIMARY KEY
);

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('Scheduled', 'Completed', 'Canceled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS Events (
  eventId              INT PRIMARY KEY,
  eventLocation        TEXT NOT NULL,
  eventTime            TIMESTAMP NOT NULL,
  releaseStart         TIMESTAMP NOT NULL,
  releaseEnd           TIMESTAMP NOT NULL,
  capacity             INT NOT NULL CHECK (capacity > 0),
  maxTicketsPerStudent INT NOT NULL CHECK (maxTicketsPerStudent = 1),
  status               event_status NOT NULL,
  categoryType         VARCHAR(100) NOT NULL REFERENCES Category(categoryType),
  staffId              INT NOT NULL REFERENCES athleticadministrator(staffId),
  CHECK (releaseStart < releaseEnd)
);

CREATE TABLE IF NOT EXISTS Ticket (
  ticketId INT PRIMARY KEY,
  eventId  INT NOT NULL REFERENCES Events(eventId) ON DELETE CASCADE,
  asurite  TEXT NOT NULL REFERENCES student(asurite) ON DELETE CASCADE,
  UNIQUE (eventId, asurite)
);