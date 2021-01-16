const db = require('../models')
const User = db.User;
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    passport.use(
        new localStrategy(async (username, password, done) => {
            console.log('hitting passport auth');
            let findUser = await User.findOne({ where: { username: username } });
            console.log(findUser);
            if (!findUser) {
                console.log('user does not exist')
                return done(null, false);
            } else {
                console.log('user exists');
                bcrypt.compare(password, findUser.password, (err, result) => {
                    console.log(result)
                    if (err) throw err;
                    if (result === true) { return done(null, findUser); }
                    else { return done(null, false); }
                })
            }
        }))


    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    })
    passport.deserializeUser((id, cb) => {
        User.findOne({ _id: id }, (err, user) => {
            const userInformation = {
                username: user.username
            };
            cb(err, userInformation);
        })
    })

};