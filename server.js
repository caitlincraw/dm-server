//--------------------------------------------------
//-----------------DEPENDENCIES---------------------
//--------------------------------------------------
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect(
  "mongodb+srv://Michael:b88bs@pamslist.zeeew.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose is connected")
  }
);

// create instance of socket server 
const server = require('http').createServer(app);
// enable CORS for local dev
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//--------------------------------------------------
//-----------------MIDDLE WARE----------------------
//--------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(session({
  secret: 'thatswhatshesaid',
  resave: true,
  saveUninitialized: true,
}));

app.use(cookieParser('thatswhatshesaid'))
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//---------------End of Middleware-------------------

//---------------POSTGRES STUFF---------------------- 
// sync server to db
// const db = require("./models");
// db.sequelize.sync();

//---------------SOCKET IO---------------------------
let numUsers = 0;

// main socket connection. all socket events go in this function. 
io.on('connection', (socket) => {
  ++numUsers;
  console.log("someone just connected", numUsers);
  
  //user connected event
  socket.on('userConnect', (userId) => {
    // hardcoded to set the userId as the socket.id right now.. need to update this when using auth and login
    userId = socket.id;
    // sends the userid/name to all connected clients. use this for the message board
    io.emit('getUser', userId);
    // sends the number of online users to all connected clients
    io.emit('numUsers', numUsers);
  })

  // message event
  socket.on('sendMessage', (data) => {
    io.emit('addMessage', data);
    console.log("message info sent", data)
  });

  // sound with message event 
  // socket.on('sendSound', (data) => {
  //   io.emit('addSound', data);
  //   console.log("sound info sent", data)
  // });

  // client disconnect socket event
  socket.on("disconnect", () => {
    console.log("client disconnected");
    numUsers--;
    io.emit('numUsers', numUsers);
    console.log("someone just left", numUsers);
  });
});

//--------------------------------------------------
//----------------------ROUTES----------------------
//--------------------------------------------------

const userRoutes = require('./routes/user');
const testRoute = require('./routes/test');

app.use('/', userRoutes);
app.use('/', testRoute);

//--------------------------------------------------
//-------------------Start Server-------------------
//--------------------------------------------------
const port = process.env.PORT || 1725;
server.listen(port, () => {
  console.log(`Express server and socket.io listening at http://localhost:${port}`);
});