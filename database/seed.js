const csv = require('csv-parser');
const fs = require('fs');

const { seedQuestion, getQuestion } = require('../models/QuestionsModel');

const { seedAnswers, getAnswers, seedPhotos, getPhotos } = require('../models/AnswerModel');

// fs.createReadStream('../seeds/questions.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     seedQuestion(row, (err) => {
//       if (err) {
//         console.error(err.stack);
//       } else {
//         console.log(`Good Insert On Record: ${row.id}`);
//       }
//     });
//   })
//   .on('end', () => {
//     getQuestion(console.log);
//     console.log('CSV file successfully processed');
//   });

fs.createReadStream('../seeds/answers.csv')
  .pipe(csv())
  .on('data', (row) => {
    seedAnswers(row, (err) => {
      if (err) {
        console.error(err.stack);
      } else {
        console.log(`Good Insert On Record: ${row.id}`);
      }
    });
  })
  .on('end', () => {
    getAnswers(console.log);
    console.log('CSV file successfully processed');
  });

// fs.createReadStream('../seeds/answers_photos.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     seedPhotos(row, (err) => {
//       if (err) {
//         console.error(err.stack);
//       } else {
//         console.log(`Good Insert On Record: ${row.id}`);
//       }
//     });
//   })
//   .on('end', () => {
//     getPhotos(console.log);
//     console.log('CSV file successfully processed');
//   });
