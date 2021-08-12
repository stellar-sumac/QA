DROP DATABASE IF EXISTS QA;

CREATE DATABASE QA;

USE QA;

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_body TEXT NOT NULL,
  question_date TIMESTAMPZ DEFAULT Now(),
  asker_name VARCHAR(60) NOT NULL,
  asker_email VARCHAR(60) NOT NULL,
  question_helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT 0,
  product_id INT FOREIGN KEY REFERENCES products(id),
);

CREATE TABLE answer (
  id SERIAL PRIMARY KEY,
  answer_body TEXT NULL,
  answer_date TIMESTAMPZ,
  answerer_name VARCHAR(60) NOT NULL,
  answerer_email VARCHAR(60) NOT NULL,
  answer_helpfulness INTEGER NOT NULL,
  reported BOOLEAN NOT NULL,
  question_id INT FOREIGN KEY REFERENCES questions(id),
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url TEXT,
  answer_id INT FOREIGN KEY REFERENCES
  answer(id),
);
