const { pool } = require('../../database/index');
const {
  seedPhotosQuery,
  seedAnswersQuery,
  seedQuestionsQuery,
} = require('../../helpers/queries');

/* eslint camelcase: 0 */
/* eslint no-console: 0 */

// each seed function extracts row data, transforms date if appl,
// and inserts the row once a client is available from the pool
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
    const dateUTC = new Date(0);
    dateUTC.setUTCMilliseconds(Number(date_written));
    const params = [
      id,
      body,
      dateUTC,
      asker_name,
      asker_email,
      helpful, reported, product_id,
    ];

    await client.query(seedQuestionsQuery, params);
  } catch (err) {
    console.error(`Failed on insert for product id ${product_id} from ${asker_name} with body - ${body}:\n${err.stack}`);
  } finally {
    client.release();
  }
};

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
    const dateUTC = new Date(0);
    dateUTC.setUTCMilliseconds(Number(date_written));
    const params = [
      id,
      body,
      dateUTC,
      answerer_name,
      answerer_email,
      helpful, reported, question_id,
    ];

    await client.query(seedAnswersQuery, params);
  } catch (err) {
    console.error(`Failed on insert for answer id ${id} from question ${question_id}:\n${err.stack}`);
  } finally {
    client.release();
  }
};

const seedPhotos = async ({
  id,
  url,
  answer_id,
}) => {
  const client = await pool.connect();
  try {
    const params = [id, url, answer_id];

    await client.query(seedPhotosQuery, params);
  } catch (err) {
    console.error(`Failed on insert for photo id ${id} from ${answer_id}:\n${err.stack}`);
  } finally {
    client.release();
  }
};

module.exports = {
  seedQuestion,
  seedAnswers,
  seedPhotos,
};
