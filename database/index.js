const postgres = require('postgres');
const path = require('path');
const config = require('./config');

const sql = postgres(config);

sql.file(path.join(__dirname, 'schema.sql'), [], {
  cache: true,
});

console.log('success');

module.exports = sql;
