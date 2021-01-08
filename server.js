require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 1725;

// parse requests of content-type - application/json
app.use(bodyParser.json());

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

io.on('connection', (socket) => {
  let addedUser = false;

  socket.on('chat', (data) => {
      socket.broadcast.emit('chat', {
          // username: socket.username,
          message: data
      });
  });
});