const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const loadSchema = () => {
  const parseBySemicolon = (filename) =>
    fs.readFileSync(filename)
      .toString('UTF8')
      .split(';');


  // Reads SQL file stream by semicolon, executes commands squentially to load schema
  const schemaCmdExecute = async (schema) => {
    const commands = parseBySemicolon(path.join(__dirname, schema));
    const client = await pool.connect();

    try {
      const toExecute = commands.map((command) => client.query(command));
      Promise.all(toExecute)
        .then(() => console.log('Success on Schema Load!'))
        .then(() => client.release())
        .catch((e) => console.error(e));
    } catch (err) {
      console.error(`Error on Schema Load to DB: \n${err.stack}`);
    } finally {
      client.release();
    }
  };

  schemaCmdExecute('schema.sql');
};


module.exports = {
  pool,
  loadSchema,
};
