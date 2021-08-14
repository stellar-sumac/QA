//const postgres = require('postgres');
const { Pool } = require('pg');
const path = require('path');
const config = require('./config');
const fs = require('fs');
const readline = require('readline');



const pool = new Pool(config);
// const sql = postgres(config);

// sql.file(path.join(__dirname, 'schema.sql'), [], {
//   cache: true,
// });
//   .then(() => console.log('success'))
//   .catch(e => console.error(e));

const readSqlBySemi = filename =>
   fs.readFileSync(filename)
   .toString('UTF8')
   .split(';');

const commands = readSqlBySemi(path.join(__dirname, 'schema.sql'))
const toExecute = commands.map(command => pool.query(command));

Promise.all(toExecute)
  .then(() => console.log('success'))
  .then(() => pool.end())
  .catch(e => console.error(e));




// commands.forEach(command => {
//   pool.query(command)
// })



module.exports = pool;
