const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../user');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser')

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
  
router.post('/register', (req, res) => {
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
  
router.get('/user', (req, res) => {
    res.send(req.user);
});
  
router.get('/logout', (req, res) => {
    console.log('logging out')
    req.logout();
    res.status(200).send("You are now logged out");
    
});

module.exports = router;