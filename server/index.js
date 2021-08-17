const express = require('express');

const etl = require('../data/etl/index');

const {
  addQuestion,
  reportQuestion,
  markQuestionHelpful,
  getQuestionsByProduct,
} = require('../models/QuestionsModel');

const {
  addAnswer,
  reportAnswer,
  markAnswerHelpful,
  getAnswersByQuestion,
} = require('../models/AnswerModel');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('Hello World!!');
  res.status(200).send();
});

// Get Routes
app.get('/qa/questions/:question_id/answers', (req, res) => {
  getAnswersByQuestion(req.params.question_id)
    .then(data => {
      res.status(200).send(data.rows[0].json_build_object);
    })
    .catch(e => {
      res.status(500).send();
      console.log(e)
    });
})

app.get('/qa/questions/:id', (req, res) => {
  getQuestionsByProduct(req.params.id)
    .then(data => {
      res.status(200).send(data.rows[0].json_build_object);
    })
    .catch(e => {
      res.status(500).send();
      console.log(e)
    });
})

// Post Routes
app.post('/qa/questions', (req, res) => {
  let question = req.body || req.data.data;
  addQuestion(question)
    .then(data => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(500).send();
    });
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  let answer = req.body || req.data.data;
  addAnswer(answer)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(500).send();
    });
})

// Put Routes
app.put('/qa/questions/:question_id/helpful', (req, res)=> {
  markQuestionHelpful(req.params.question_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(e => {
      res.status(500).send();
      console.log(e)
    })
})

app.put('/qa/answers/:answer_id/helpful', (req, res)=> {
  markAnswerHelpful(req.params.answer_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(e => {
      res.status(500).send();
      console.log(e)
    })
})

app.put('/qa/questions/:question_id/report', (req, res)=> {
  reportQuestion(req.params.question_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(e => {
      res.status(500).send();
      console.log(e)
    })
})

app.put('/qa/answers/:answer_id/report', (req, res)=> {
  reportAnswer(req.params.answer_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(e => {
      res.status(500).send();
      console.log(e)
    })
})

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`QA Microservice running on ${port}`);
});
