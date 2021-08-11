/*eslint-disable */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/qa', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const questions = mongoose.Schema({
  _id: {type: Number, unique: true},
  question_body: String,
  question_date: Date,
  asker_name: String,
  asker_email: String,
  question_helpfulness: { type: Number, default: 0 },
  reported: Boolean,
  answers: {
    type: Map,
    of: {
      _id: {type: Number, unique: true},
      answer_body: String,
      answer_date: Date,
      answerer_name: String,
      answer_helpfulness: { type: Number, default: 0 },
      reported: Boolean,
      photos: [{
         _id: {type: Number, unique: true},
          url: String
      }],
    }
  }
});
