const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

const loadSchema = () => {
  const parseBySemicolon = filename =>
      fs.readFileSync(filename)
      .toString('UTF8')
      .split(';');

  // Reads SQL file stream by semicolon, executes commands squentially to load schema
  const schemaCmdExecute = async () => {
    const commands = parseBySemicolon(path.join(__dirname, 'schema.sql'));
    const client = await pool.connect();

    try {
      const toExecute = commands.map(command => client.query(command))
      Promise.all(toExecute)
        .then(() => console.log('Success on Schema Load!'))
        .then(() =>client.release())
        .catch(e => console.error(e));
    } catch (err) {
      err => console.log(`Error on Schema Load to DB: \n${err.stack}`);
    }
  }
  schemaCmdExecute();
}

module.exports = {
  pool,
  loadSchema,
};
