const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require('passport')
// load user model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // match User
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            // done => callback
            return done(null, false, {
              message: "that email is not registered",
            });
          }
          // match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "password incorrect" });
            }
          });
        })
        .catch((e) => console.log(e));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch(err) {
        done(err, null)
    }
    });

};
