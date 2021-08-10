const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('Hello World');
  res.status(200).send();
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`QA Microservice running on ${port}`);
});
