const seedQuestionsQuery = `
INSERT INTO questions(id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, product_id)
  VALUES( $1, $2, $3, $4, $5, $6, $7, $8)
`;

const seedAnswersQuery = `
INSERT INTO answers(id, answer_body, answer_date, answerer_name, answerer_email, answer_helpfulness, reported, question_id) VALUES( $1, $2, $3, $4, $5, $6, $7, $8)
`;

const seedPhotosQuery = `
INSERT INTO photos(id, url, answer_id) VALUES( $1, $2, $3)
`;

const getQuestionsQuery = `
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
        SELECT COALESCE (jsonb_object_agg(
          a.id, json_build_object(
            'id', a.id,
            'body', a.answer_body,
            'date', a.answer_date,
            'answerer_name', a.answerer_name,
            'helpfulness', a.answer_helpfulness,
            'photos', (
              SELECT COALESCE (jsonb_agg(
                jsonb_build_object(
                  'id', p.id,
                  'url', p.url
                )
              ), '[]')::jsonb FROM photos p WHERE a.id = p.answer_id
            )
          )
        ), '[]')::jsonb FROM answers a WHERE a.reported != true AND q.id = a.question_id
      )
    )
  )
)::jsonb FROM questions q WHERE product_id=$1 AND q.reported != true
`;
const getAnswersQuery = `
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
        SELECT COALESCE (jsonb_agg(
          jsonb_build_object(
            'id', p.id,
            'url', p.url
          )
        ), '[]')::jsonb FROM photos p WHERE a.id = p.answer_id
      )
    )
  )
)::jsonb FROM answers a WHERE question_id=$1 AND a.reported != true
`;

const addQuestionQuery = `
INSERT INTO questions(question_body, asker_name, asker_email, product_id)
  VALUES($1, $2, $3, $4)
`;
const addAnswerQuery = `
INSERT INTO answers(answer_body, answerer_name, asker_email, question_id)
  VALUES($1, $2, $3, $4)
`;

const markAnsHelpfulQuery = `
UPDATE answers
  SET answer_helpfulness = answer_helpfulness + 1
    WHERE id = $1
`;
const reportAnswerQuery = `
UPDATE answers
  SET reported = true
    WHERE id = $1
`;

module.exports = {
  addAnswerQuery,
  seedPhotosQuery,
  getAnswersQuery,
  seedAnswersQuery,
  addQuestionQuery,
  getQuestionsQuery,
  reportAnswerQuery,
  seedQuestionsQuery,
  markAnsHelpfulQuery,
};
