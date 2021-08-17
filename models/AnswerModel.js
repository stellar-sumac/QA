const { Pool } = require('pg');
const config = require('../database/config');
/* eslint-disable */


const pool = new Pool(config);

const getAnswersByQuestion = async (qid, page = 1, count = 5) => {
  const client = await pool.connect();
  let results = null;

  const getAnswersQuery =`
  SELECT json_build_object(
    'question', $5::text,
    'page', $2::integer,
    'count', $3::integer,
    'results', json_agg(
      jsonb_build_object(
        'answer_id', a.id,
        'body', a.answer_body,
        'date', a.answer_date,
        'answerer_name', a.answerer_name,
        'helpfulness', a.answer_helpfulness,
        'reported', $4::boolean,
        'photos', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', p.id,
              'url', p.url
            )
          )::jsonb FROM photos p WHERE a.id = p.answer_id
        )
      )
    )
  )::jsonb FROM answers a WHERE question_id=$1 AND a.reported != true
  `

  try {
    results = await client.query(getAnswersQuery, [qid, page, count, false, (qid + '')])
  } catch (err) {
    console.error(`Failed getting answers list for question id ${qid} with error:\n${err}`)
  } finally {
    client.release();
    return results;
  }
}

const markAnswerHelpful = async (aid) => {
  const client = await pool.connect();

  const markAnsHelpfulQuery =`UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1`
  try {
    await client.query(markAnsHelpfulQuery, [aid])
  } catch (err) {
    console.error(`Failed marking answer helpful for answer id ${aid} with error:\n${err}`)
  } finally {
    client.release();
  }
}

const reportAnswer = async (aid) => {
  const client = await pool.connect();

  const reportAnswerQuery =`UPDATE answers SET reported = true WHERE id = $1`
  try {
    await client.query(reportAnswerQuery, [aid])
  } catch (err) {
    console.error(`Failed reporting answer for answer id ${aid} with error:\n${err}`)
  } finally {
    client.release();
  }
}

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

const addAnswer = ({ answer_body, answerer_name, answerer_email, question_id }, callback) => {
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
  helpful,
  reported,
  question_id,
  date_written,
  answerer_name,
  answerer_email,
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
  addAnswer,
  getPhotos,
  seedPhotos,
  getAnswers,
  seedAnswers,
  reportAnswer,
  markAnswerHelpful,
  getAnswersByQuestion,
};
