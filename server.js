require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 1725;

const index = require('./routes/index');

app.use(index);

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
server.listen(port, () => {
  console.log(`Express server and socket.io listening at http://localhost:${port}`);
});

// socket.io events
io.on('connection', (socket) => {
  // let addedUser = false;

  console.log("a client is connected");

  socket.on('sendMessage', (message) => {
      io.emit('message', message);
      console.log(`${message} sent`)
  });

  // client disconnect socket event
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});