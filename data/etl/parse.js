const { pool } = require('../../database/index');

// each seed function extracts row data, transforms date if appl, and inserts the row once a client is available from the pool
const seedQuestion = async ({
  id,
  body,
  helpful,
  reported,
  product_id,
  asker_name,
  asker_email,
  date_written,
}) => {

  const client = await pool.connect();
  try {
    const d = new Date(0);
    d.setUTCMilliseconds(Number(date_written));
    date_written = d;

    let params = [id, body, date_written, asker_name, asker_email, helpful, reported, product_id ];

    await client.query("INSERT INTO questions(id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, product_id) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)", params);

  } catch (err) {
    console.error(`Failed on insert for product id ${product_id} from ${asker_name} with body - ${body}:\n${err.stack}`);
  } finally {
    client.release();
  }
}

const seedAnswers = async ({
  id,
  body,
  helpful,
  reported,
  question_id,
  date_written,
  answerer_name,
  answerer_email,
}) => {

  const client = await pool.connect();
  try {
    const d = new Date(0);
    d.setUTCMilliseconds(Number(date_written));
    date_written = d;

    let params = [id, body, date_written, answerer_name, answerer_email, helpful, reported, question_id ];

    await client.query("INSERT INTO answers(id, answer_body, answer_date, answerer_name, answerer_email, answer_helpfulness, reported, question_id) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)", params);

  } catch (err) {
    console.error(`Failed on insert for answer id ${id} from question ${question_id}:\n${err.stack}`);
  } finally {
    client.release();
  }
}

const seedPhotos = async ({
  id,
  url,
  answer_id,
}) => {

  const client = await pool.connect();
  try {
    let params = [id, url, answer_id ];

    await client.query("INSERT INTO photos(id, url, answer_id) VALUES( $1, $2, $3)", params);

  } catch (err) {
    console.error(`Failed on insert for photo id ${id} from ${answer_id}:\n${err.stack}`);
  } finally {
    client.release();
  }
}

module.exports = {
  seedQuestion,
  seedAnswers,
  seedPhotos
};
