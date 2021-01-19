const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models')
const User = db.User;
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

router.use(bodyParser.json())

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;  
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {return next(err);}
            if (!user) {return res.send(info.message);}
            req.logIn(user, err => {
                if (err) {return next(err);}
                res.send('Successfully Authenticated User');
                console.log("after authenticated", req.user);
            })
        }
    )(req, res, next);
});

router.post('/register', async (req, res) => {
    let { username, password } = req.body;
    console.log({ username, password })

    let errors = [];

    if (!username || !password) {
        errors.push({ message: "Please fill required fields." });
    }
    if (password.length < 6) {
        errors.push({ message: "Password needs to be a minimum of 6 characters." })
    }

    if (errors.length > 0) {
        res.send(errors);
    } else {

    const newUser = await User.findOne({
      where: {
        username: username
      },
    });

    if (newUser) {
      res.send("User already exists.")
    }
    if (!newUser) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const createUser = await User.create({
        username: username,
        password: hashedPassword
      });
      res.send(`User with username: ${username} Created` );
    };
  }
});

router.get('/user', (req, res) => {
    console.log("this is req.user in the /user", req.user);
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send("You are now logged out");
});

module.exports = router;