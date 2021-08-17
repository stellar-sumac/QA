const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const ps = require('promise-streams');
const { seedQuestion, seedAnswers, seedPhotos } = require('./parse');

const etl = () => {
    const tables = [
    {
      name: 'questions',
      seed: seedQuestion,
    },
    {
      name: 'answers',
      seed: seedAnswers,
    },
    {
      name: 'answers_photos',
      seed: seedPhotos,
    },
  ];

  // Extracts stream from each csv and seeds each row with max buffer of 8 parses
  tables.forEach(table => {
    fs.createReadStream(path.join(__dirname, `../${table.name}.csv`))
    .pipe(csv())
    .pipe(ps.map({concurrent: 8}, row => table.seed(row)))
    .wait().then(() => {
      console.log(`${table.name} CSV file successfully processed`);
    });
  })
}

module.exports = etl;