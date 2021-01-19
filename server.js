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
const axios = require('axios');
const app = express();

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
require('./config/passportConfig')(passport);

//---------------End of Middleware-------------------

//---------------POSTGRES STUFF---------------------- 
// sync server to db
const db = require("./models");
db.sequelize.sync();

//---------------SOCKET IO---------------------------
let numUsers = 0;

// main socket connection. all socket events go in this function. 
io.on('connection', (socket) => {
  ++numUsers;
  console.log("someone just connected", numUsers);

  //user connected event
  socket.on('userConnect', (userId) => {
    // hardcoded to set the userId as the socket.id right now.. need to update this when using auth and login
    // userId = socket.id;
    userId = axios.get('/user')
      .then(response => {
        console.log(response.data.url);
      })
      .catch(error => {
        console.log(error)
      })
    // sends the userid/name to all connected clients. use this for the message board
    io.emit('getUser', userId);
    // sends the number of online users to all connected clients
    io.emit('numUsers', numUsers);
    // broadcast door opening song to everyone but the person who just joined
    // socket.broadcast.emit('playDoorOpenSound', null);
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
    io.emit('numUsers', numUsers);
    console.log("someone just left", numUsers);
    //socket.broadcast.emit('playDoorCloseSound', null)
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