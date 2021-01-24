const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models')
const User = db.User;
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const ensureAuthenticated = require('../routes/ensureAuthenticated')

router.use(bodyParser.json())

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;
    passport.authenticate('local',
        (err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                return res.send(info.message);
            }
            req.logIn(user, err => {
                if (err) {
                    return next(err);
                }
                console.log('user in login:', user)
                return res.send('Successfully Authenticated User');
            })
        }
    )(req, res, next);
});

exports.isLocalAuthenticated = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); } //error exception

        // user will be set to false, if not authenticated
        if (!user) {
            res.status(401).json(info); //info contains the error message
        } else {
            // if user authenticated maintain the session
            req.logIn(user, function () {
                // do whatever here on successful login
            })
        }
    })(req, res, next);
}

router.post('/register', async (req, res) => {
    let { username, password } = req.body;

    let error;

    if (!username || !password) {
        error = "Please fill out both a username and a password.";
    }
    if (password && password.length < 6) {
        error = "Password must be a minimum of 6 characters.";
    }

    if (username && username.length > 15) {
        error = "Please keep your username to less than 15 characters."
    }

    if (username === "DMI ADMIN") {
        error = "DMI ADMIN is a reserved username."
    }

    if (error) {
        res.send(error);
    } else {

        const newUser = await User.findOne({
            where: {
                username: username
            },
        });

        if (newUser) {
            res.send(`${username} already exists. Please try again.`)
        }
        if (!newUser) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const createUser = await User.create({
                username: username,
                password: hashedPassword
            });
            res.send(`Success! The user, ${username}, was created. Please proceed to login.`);
        };
    }
});

router.get('/user', (req, res) => {
    if (req.user) {
        res.send(req.user);
    }
    if (!req.user) {
        res.send("user not logged");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy;
    req.logout();
    res.status(200).send("You are now logged out");
});

router.get('/status', (req, res) => {
    res.send(req.isAuthenticated())
})

module.exports = router;