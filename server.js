require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 1725;

// sync server to db
const db = require("./models");
db.sequelize.sync();

// test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// listen for requests
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});