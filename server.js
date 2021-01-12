//--------------------------------------------------
//-----------------DEPENDENCIES---------------------
//--------------------------------------------------
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const User = require('./user');
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
const server = require('http').createServer(app);
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

// sync server to db
const db = require("./models");
db.sequelize.sync();

// test route
app.get('/', (req, res) => {
  res.send('Hello World!');
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

//--------------------------------------------------
//----------------------ROUTES----------------------
//--------------------------------------------------
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.send('No user exits!');
    else {
      req.logIn(user, err => {
        if (err) throw err;
        res.send('Successfully Authenticated');
        console.log(req.user);
      })
    }
  })(req, res, next);
});

app.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User already exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword
      });
      await newUser.save();
      res.send("User Created");
    }
  })
});

app.get('/user', (req, res) => {
  res.send(req.user);
});

app.get('/logout', (req, res) => {
  console.log('logging out')
  req.logout();
  res.redirect('/');
});



//--------------------------------------------------
//-------------------Start Server-------------------
//--------------------------------------------------
const port = process.env.PORT || 1725;
server.listen(port, () => {
  console.log(`Express server and socket.io listening at http://localhost:${port}`);
});