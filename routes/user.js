const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models')
const User = db.User;
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const sequelize = require('sequelize');

router.use(bodyParser.json())

router.post('/login', (req, res, next) => {
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

router.post('/register', async (req, res) => {
  // let { username, password } = req.body;
  // console.log({ username, password })

  // let errors = [];

  // if (!username || !password) {
  //   errors.push({ message: "Please fill required fields." });
  // }
  // if (password.length < 6) {
  //   errors.push({ message: "Password needs to be a minimum of 6 characters." })
  // }

  // if (errors.length > 0) {
  //   console.log({ errors });
  // } else {
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   User.sequelize.query(
  //     `SELECT * FROM "Users"
  //     WHERE username = $1`,
  //     [username],
  //     (err, results) => {
  //       if (err) {
  //         throw err
  //       }

  //       console.log(results.rows);

  //       // if (doc) res.send('User already exists');
  //       // if (!doc) 
  //     }
  //   )

  //   //   const newUser = new User({
  //   //     username: username,
  //   //     password: hashedPassword
  //   //   });
  // }

  await User.findOne({
    where: {
      username: req.body.username
    },
  }, async (err, doc) => {
    if (err) { throw err, console.log('i am in throw error') };
    if (doc) res.send("User already exists");
    if (!doc) {
      console.log("does this work");
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = await User.create({
        username: req.body.username,
        password: hashedPassword
      });
      res.send("User Created");
    }
  })
});

router.get('/user', (req, res) => {
  res.send(req.user);
});

router.get('/logout', (req, res) => {
  console.log('logging out')
  req.logout();
  res.status(200).send("You are now logged out");

});

module.exports = router;