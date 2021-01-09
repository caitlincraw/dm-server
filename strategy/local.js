require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport')
const db = require('../models');

const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

router.use(bodyParser.json())

router.get('/home', (req, res) => {
    res.json({
        location: 'you are in passport'
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