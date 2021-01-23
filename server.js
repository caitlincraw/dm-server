//--------------------------------------------------
//-----------------DEPENDENCIES---------------------
//--------------------------------------------------
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// create instance of socket server 
// might need to be https for deploy
const server = require('http').createServer(app);
// enable CORS 
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

//--------------------------------------------------
//-----------------MIDDLE WARE----------------------
//--------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.ORIGIN_PATH,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

const sessionMiddleware = session({
  secret: 'thatswhatshesaid',
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

app.use(cookieParser('thatswhatshesaid'))
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportConfig')(passport);

// wrapping function to connect socket and express middlewares
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});

//---------------------------------------------------
//---------------POSTGRES STUFF---------------------- 
//---------------------------------------------------

const db = require("./models");
db.sequelize.sync();

//---------------------------------------------------
//---------------SOCKET IO---------------------------
//---------------------------------------------------
let numUsers = 0;

// main socket connection. all socket events go in this function. 
io.on('connection', (socket) => {
  ++numUsers;
  console.log("someone just connected", numUsers);

  //connecting to session
  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();
  console.log(session)
  
  //user connected event
  socket.on('userConnect', (user) => {
    socket.emit('getUser', user);
    socket.emit('numUsers', numUsers);
    socket.broadcast.emit('playDoorOpenSound', null);
    socket.username = user.username;
    session.socketUsername = socket.username;
    session.save();
    socket.broadcast.emit('userJoin', {
      user: "DMI ADMIN",
      message: `${socket.username} has joined the chatroom 😃😃😃`
    });
  })

  // message event
  socket.on('sendMessage', (data) => {
    io.emit('addMessage', data);
    console.log("message info sent", data)
  });

  // sound with message event 
  socket.on('sendSound', (srcOfSound) => {
    io.emit('addSound', srcOfSound);
    console.log("sound info sent", srcOfSound)
  });

  // client disconnect socket event
  socket.on("disconnect", () => {
    console.log("client disconnected");
    numUsers--;
    socket.emit('numUsers', numUsers);
    console.log("someone just left", numUsers);
    socket.broadcast.emit('userLeft', {
      user: "DMI ADMIN",
      message: `${socket.username} has left the chatroom 😞😞😞`
    });
    socket.broadcast.emit('playDoorCloseSound', null)
  });
});

//--------------------------------------------------
//----------------------ROUTES----------------------
//--------------------------------------------------

const userRoutes = require('./routes/user');
const prodRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const testRoute = require('./routes/test');

app.use('/', userRoutes);
app.use('/', testRoute);
app.use('/products', prodRoutes);
app.use('/cart', cartRoutes);

//--------------------------------------------------
//-------------------Start Server-------------------
//--------------------------------------------------
const port = process.env.PORT || 1725;
server.listen(port, () => {
  console.log(`Express server and socket.io listening at http://localhost:${port}`);
});