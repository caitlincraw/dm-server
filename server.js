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
    origin: "http://localhost:3000",
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

// test route
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

//---------------SOCKET IO---------------------------

// events
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