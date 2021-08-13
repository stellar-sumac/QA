DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_body TEXT NOT NULL,
  question_date TIMESTAMP DEFAULT NOW(),
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  question_helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  product_id INTEGER
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  answer_body TEXT NOT NULL,
  answer_date TIMESTAMP DEFAULT NOW(),
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  answer_helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  question_id INTEGER NOT NULL
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url TEXT,
  answer_id INTEGER NOT NULL
);

ALTER TABLE answer ADD FOREIGN KEY (question_id) REFERENCES questions (id);
ALTER TABLE photos ADD FOREIGN KEY (answer_id) REFERENCES answers (id);