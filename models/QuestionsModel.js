const { pool } = require('../database/index');

const {
  isValidQueryParams,
} = require('../helpers/validation');

const { getQuestionsQuery } = require('../helpers/queries');
/* eslint camelcase: 0 */
/* eslint no-console: 0 */

const getQuestionsByProduct = async (pid, page = 1, count = 5) => {
  if (isValidQueryParams(page) || isValidQueryParams(count)) return `Bad Query Parameters, Check page: ${page} and count ${count}`;

  const client = await pool.connect();
  try {
    const results = await client.query(getQuestionsQuery, [pid, page, count, false]);
    return results.rows[0].json_build_object;
  } catch (err) {
    return `Failed getting questions for product id ${pid} with error:\n${err}`;
  } finally {
    client.release();
  }
};

const markQuestionHelpful = async (qid) => {
  const markQuestionHelpfulQuery = `
  UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE id = $1
  `;
  const client = await pool.connect();

  try {
    await client.query(markQuestionHelpfulQuery, [qid]);
  } catch (err) {
    console.error(`Failed marking question helpful for question id ${qid} with error:\n${err}`);
  } finally {
    client.release();
  }
};

const reportQuestion = async (qid) => {
  const reportQuestionQuery = `
  UPDATE questions SET reported = true WHERE id = $1
  `;
  const client = await pool.connect();

  try {
    await client.query(reportQuestionQuery, [qid]);
  } catch (err) {
    console.error(`Failed reporting question for question id ${qid} with error:\n${err}`);
  } finally {
    client.release();
  }
};

const addQuestion = async ({
  pid,
  body,
  name,
  email,
}) => {
  const insertQuestionQuery = `INSERT INTO questions(question_body, asker_name, asker_email, product_id)
  VALUES($1, $2, $3, $4)`;
  const client = await pool.connect();

  try {
    await client.query(insertQuestionQuery, [body, name, email, pid]);
  } catch (err) {
    console.error(`Failed on insert for product id ${pid} from ${name} with body - ${body}:\n${err}`);
  } finally {
    client.release();
  }
};

module.exports = {
  addQuestion,
  reportQuestion,
  markQuestionHelpful,
  getQuestionsByProduct,
};
