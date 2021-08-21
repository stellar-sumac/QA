const express = require('express');
const {
  isValidId,
  isValidBody,
} = require('../helpers/validation');

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

/* eslint camelcase: 0 */

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('Microservice running');
  res.status(200).send();
});

app.get(`/${process.env.LOADER_IO}`, (req, res) => {
  res.send(process.env.LOADER_IO);
});

// Get Routes
app.get('/qa/questions/:question_id/answers', (req, res) => {
  if (!isValidId(req.params.question_id)) {
    res.status(500).send(`Cant get answers for question id: ${req.params.question_id}. Must be of integer type`);
  } else {
    getAnswersByQuestion(req.params.question_id)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((e) => {
	console.log(e);
        res.status(500).send(e);
      });
  }
});

app.get('/qa/questions/:id', (req, res) => {
  if (!isValidId(req.params.id)) {
    res.status(500).send(`Cant get questions for product id: ${req.params.id}. Must be of integer type`);
  } else {
    getQuestionsByProduct(req.params.id)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

// Post Routes
app.post('/qa/questions', (req, res) => {
  const question = req.body || req.data.data;
  const {
    body,
    name,
    email,
  } = question;
  isValidBody(body, name, email);

  if (!isValidBody(body, name, email)) {
    res.status(500).send('Failed Request. Need valid question body...');
  } else {
    addQuestion(question)
      .then(() => {
        res.status(201).send();
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const answer = req.body || req.data.data;
  const {
    answer_body,
    answerer_name,
    answerer_email,
  } = answer;
  if (!isValidBody(answer_body, answerer_name, answerer_email)) {
    res.status(500).send('Failed Request. Need valid answer body...');
  } else {
    addAnswer(answer)
      .then(() => {
        res.status(201).send();
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

// Put Routes
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  if (!isValidId(req.params.question_id)) {
    res.status(500).send('Failed Request. Need valid question id...');
  } else {
    markQuestionHelpful(req.params.question_id)
      .then(() => {
        res.status(204).send();
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  if (!isValidId(req.params.answer_id)) {
    res.status(500).send('Failed Request. Need valid answer id...');
  } else {
    markAnswerHelpful(req.params.answer_id)
      .then(() => {
        res.status(204).send();
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  if (!isValidId(req.params.question_id)) {
    res.status(500).send('Failed Request. Need valid answer id...');
  } else {
    reportQuestion(req.params.question_id)
      .then(() => {
        res.status(204).send();
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  if (!isValidId(req.params.answer_id)) {
    res.status(500).send('Failed Request. Need valid question id...');
  } else {
    reportAnswer(req.params.answer_id)
      .then(() => {
        res.status(204).send();
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`QA Microservice running on ${port}`);
});
