const db = require('../models')
const User = db.User;
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

const NO_USER_FOUND = "No user found."
const PASSWORD_DOES_NOT_MATCH = "Password does not match."

module.exports = (passport) => {

    passport.use(new localStrategy(
        async function (username, password, done) {
            const user = await User.findOne({
                where: {
                    username: username
                }
            }).catch(error => { return done(error) });
            if (!user) {
                return done(null, false, { message: NO_USER_FOUND });
            }
            let matched = await bcrypt.compare(password, user.password);
            if (!matched) {
                return done(null, false, { message: PASSWORD_DOES_NOT_MATCH });
            }
            return done(null, user);
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    // passport.deserializeUser(function (user, cb) {
    //     console.log(user)
    //     db.User.findOne({
    //         where: { username: user }
    //     }, function (err, user) {
    //         if (err) { return cb(err); }
    //         cb(null, user);
    //     })
    // })

    passport.deserializeUser(async (username, done) => {
        try {
            let user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (!user) {
                return done(new Error('user not found'));
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}