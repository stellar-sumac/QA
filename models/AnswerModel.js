const { pool } = require('../database/index');

const {
  isValidQueryParams,
} = require('../helpers/validation');

const { getAnswersQuery } = require('../helpers/queries');
/* eslint camelcase: 0 */
/* eslint no-console: 0 */

const getAnswersByQuestion = async (qid, page = 1, count = 5) => {
  if (isValidQueryParams(page) || isValidQueryParams(count)) return `Bad Query Parameters, Check page: ${page} and count ${count}`;

  const client = await pool.connect();

  try {
    const results = await client.query(getAnswersQuery, [qid, page, count, false, (`${qid}`)]);
    return results.rows[0].json_build_object;
  } catch (err) {
    return `Failed getting answers list for question id ${qid} with error:\n${err}`;
  } finally {
    client.release();
  }
};

const markAnswerHelpful = async (aid) => {
  const markAnsHelpfulQuery = `
  UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE id = $1
  `;
  const client = await pool.connect();

  try {
    await client.query(markAnsHelpfulQuery, [aid]);
  } catch (err) {
    console.error(`Failed marking answer helpful for answer id ${aid} with error:\n${err}`);
  } finally {
    client.release();
  }
};

const reportAnswer = async (aid) => {
  const reportAnswerQuery = `
  UPDATE answers SET reported = true WHERE id = $1
  `;
  const client = await pool.connect();

  try {
    await client.query(reportAnswerQuery, [aid]);
  } catch (err) {
    console.error(`Failed reporting answer for answer id ${aid} with error:\n${err}`);
  } finally {
    client.release();
  }
};

const addAnswer = async ({
  answer_body,
  question_id,
  answerer_name,
  answerer_email,
}) => {
  const client = await pool.connect();

  const addAnswerQuery = `INSERT INTO answers(answer_body, answerer_name, asker_email, question_id)
  VALUES($1, $2, $3, $4)`;

  try {
    await client.query(addAnswerQuery, [answer_body, answerer_name, answerer_email, question_id]);
  } catch (err) {
    console.error(`Failed on insert for product id ${question_id} from ${answerer_name} with body - ${answer_body}:\n${err}`);
  } finally {
    client.release();
  }
};

module.exports = {
  addAnswer,
  reportAnswer,
  markAnswerHelpful,
  getAnswersByQuestion,
};
