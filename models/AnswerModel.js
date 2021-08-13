const { Pool } = require('pg');
const { config } = require('../database/config');
/* eslint-disable */


const pool = new Pool({ config });

const getAnswers = (callback) => {
  pool.query("SELECT * FROM answers", (err, results) => {
    if (err) {
      console.log('Failed Getting Answers at Model layer');
      callback(err, results);
    } else {
      callback(null, results.rows);
    }
  });
};

const addAnswer = (answer_body, answerer_name, answerer_email, question_id, callback) => {
  pool.query(`INSERT INTO questions(answer_body, answerer_name, asker_email, question_id)
  VALUES(${answer_body}, ${answerer_name}, ${answerer_email}, ${question_id})`, (err, status) => {
    if (err) {
      console.log(`Failed on insert for product id ${question_id} from ${answerer_name} with body - ${answer_body}:\n${err}`);
      callback(err, status);
    } else {
      callback(null, status);
    }
  });
};

const seedAnswers = ({
  id,
  body,
  answerer_name,
  answerer_email,
  helpful,
  reported,
  question_id,
  date_written,
}, callback) => {

  const d = new Date(0);
  d.setUTCMilliseconds(Number(date_written));
  date_written = d;

  let params = [id, body, date_written, answerer_name, answerer_email, helpful, reported, question_id ];

  pool.query("INSERT INTO answers(id, answer_body, answer_date, answerer_name, answerer_email, answer_helpfulness, reported, question_id) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)", params, (err, status) => {
    if (err) {
      console.log(`Failed on insert for question id ${question_id} from ${answerer_name} with body - ${body}:\n${err}`);
      callback(err, status);
    } else {
      callback(null, status);
    }
  });
};

const seedPhotos = ({
  id,
  url,
  answer_id,
}, callback) => {

  let params = [id, url, answer_id ];

  pool.query("INSERT INTO photos(id, url, answer_id) VALUES( $1, $2, $3)", params, (err, status) => {
    if (err) {
      console.log(`Failed on insert for photo id ${id} from ${answer_id}:\n${err}`);
      callback(err, status);
    } else {
      callback(null, status);
    }
  });
};

const getPhotos = () => {
  pool.query("SELECT * FROM photos", (err, res) => {
    if (err) {
      console.log('Failed Getting Photos at Model layer');
      callback(err, results);
    } else {
      callback(null, results.rows);
    }
  })
}



module.exports = {
  getAnswers,
  addAnswer,
  seedAnswers,
  seedPhotos,
  getPhotos,
};
