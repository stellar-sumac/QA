const { Pool } = require('pg');
const config = require('../database/config');

const pool = new Pool(config);

const getQuestionsByProduct = async (pid, page, count) => {
  // psql command to shape data as required
    // results arr of questions
      // answer objects keyed by id
  const getQuestionQuery =`
  SELECT json_build_object(
    'product_id', $1::integer,
    'results', json_agg(
      jsonb_build_object(
        'question_id', q.id,
        'question_body', q.question_body,
        'question_date', q.question_date,
        'asker_name', q.asker_name,
        'question_helpfulness', q.question_helpfulness,
        'reported', $2::boolean,
        'answers', (
          SELECT jsonb_object_agg(
            a.id, json_build_object(
              'id', a.id,
              'body', a.answer_body,
              'date', a.answer_date,
              'answerer_name', a.answerer_name,
              'helpfulness', a.answer_helpfulness,
              'photos', (
                SELECT jsonb_agg(
                  p.url
                )::jsonb FROM photos p WHERE a.id = p.answer_id
              )
            )
          )::jsonb FROM answers a WHERE a.reported != true AND q.id = a.question_id
        )
      )
    )
  )::jsonb FROM questions q WHERE product_id=$1 AND q.reported != true
  `
  const client = await pool.connect();
  let results = null;
  try {
    results = await client.query(getQuestionQuery, [pid, false])
  } catch (err) {
    console.error(`Failed getting questions for product id ${pid} with error:\n${err}`)
  } finally {
    client.release();
    return results;
  }
}

const markQuestionHelpful = async (qid) => {
  const client = await pool.connect();

  const markQuestionHelpfulQuery =`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE id = $1`
  try {
    await client.query(markQuestionHelpfulQuery, [qid])
  } catch (err) {
    console.error(`Failed marking question helpful for question id ${qid} with error:\n${err}`)
  } finally {
    client.release();
  }
}

const reportQuestion = async (qid) => {
  const client = await pool.connect();

  const reportQuestionQuery =`UPDATE questions SET reported = true WHERE id = $1`
  try {
    await client.query(reportQuestionQuery, [qid])
  } catch (err) {
    console.error(`Failed reporting question for question id ${qid} with error:\n${err}`)
  } finally {
    client.release();
  }
}

const getQuestions = (callback) => {
  pool.query("SELECT * FROM questions", (err, results) => {
    if (err) {
      console.log('it broke');
      callback(err, results);
    } else {
      callback(null, results.rows);
    }
  });
};

const addQuestion = ({ body, name, email, pid }, callback) => {
  pool.query(`INSERT INTO questions(question_body, asker_name, asker_email, product_id)
  VALUES(${body}, ${name}, ${email}, ${pid})`, (err, status) => {
    if (err) {
      console.log(`Failed on insert for product id ${pid} from ${name} with body - ${body}:\n${err}`);
      callback(err, status);
    } else {
      callback(null, status);
    }
  });
  pool.end()
};

const seedQuestion = ({
  id,
  body,
  helpful,
  reported,
  product_id,
  asker_name,
  asker_email,
  date_written,
}, callback) => {
  // Date Parse
  const d = new Date(0);
  d.setUTCMilliseconds(Number(date_written));
  date_written = d;

  let params = [id, body, date_written, asker_name, asker_email, helpful, reported, product_id ];

  pool.query("INSERT INTO questions(id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, product_id) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)", params, (err, status) => {
    if (err) {
      console.log(`Failed on insert for product id ${product_id} from ${asker_name} with body - ${body}:\n${err}`);
      callback(err, status);
    } else {
      callback(null, status);
    }
  });
};

module.exports = {
  addQuestion,
  seedQuestion,
  getQuestions,
  reportQuestion,
  markQuestionHelpful,
  getQuestionsByProduct,
};
