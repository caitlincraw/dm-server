//----------------------------------------------
//-------------LOADING DEPENDENCIES-------------
//----------------------------------------------

require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

//----------------------------------------------
//-------------Configuring Local Strategy-------------
//----------------------------------------------
passport.use(new LocalStrategy(
  function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }
));

//----------------------------------------------
//-------------------Passport Session Persistence-------------------
//----------------------------------------------

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({ secret: "thatswhatshesaid", resave: false, saveUninitialized: false}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  console.log('passport home')
  res.render('home', { user: req.user });
});

app.get('/login', function (req, res) {
  console.log("you are logging in")
  res.redirect('/');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    console.log('login post'),
    res.redirect('/');
  });

app.get('/logout' , function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/profile', require('connect-ensure-login').ensureLoggedIn(),
function ( req, res) {
  res.render('profiles', {user: req.user});
});
