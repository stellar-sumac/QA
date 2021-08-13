const { Pool } = require('pg');
const { config } = require('../database/config');

// const insertQuestion = ( body, name, email, pid) => {
//   const [new_user] = await sql`
//     insert into questions (question_body, asker_name, asker_email, product_id) values`
// };

const pool = new Pool({ config });


const getQuestion = (callback) => {
  pool.query("SELECT * FROM questions", (err, results) => {
    if (err) {
      console.log('it broke');
      callback(err, results);
    } else {
      callback(null, results.rows);
    }
  });
};

// const getQuestions = (pid) => {
//   const results = [];
//   pool.query(`SELECT * FROM questions WHERE product_id =${pid}`, (err) => {

//   });
// };

const addQuestion = (body, name, email, pid, callback) => {
  pool.query(`INSERT INTO questions(question_body, asker_name, asker_email, product_id)
  VALUES(${body}, ${name}, ${email}, ${pid})`, (err, status) => {
    if (err) {
      console.log(`Failed on insert for product id ${pid} from ${name} with body - ${body}:\n${err}`);
      callback(err, status);
    } else {
      callback(null, status);
    }
  });
};

const seedQuestion = ({
  id,
  body,
  asker_name,
  asker_email,
  helpful,
  reported,
  product_id,
  date_written,
}, callback) => {
  // Number Conversion Option 1
  const d = new Date(0);
  d.setUTCMilliseconds(Number(date_written));
  date_written = d;

  // Number Conversion Option 2
  // Update date after insert, will require two

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
  getQuestion,
  addQuestion,
  seedQuestion,
};
