const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport')
// Use model
const User = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

// Register Handel
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];
  let success = []

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill in all the fields" });
  }

  //check passwords match
  if (password !== password2) {
    errors.push({ msg: "password do not match" });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }
  try {
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      errors.push({ msg: "Email is already registered" });
       return res.render("register", {
        errors,
        name,
        email,
        password,
        password2,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ 
        name, 
        email,
        password: hashedPassword });
    await newUser.save()
    success.push({msg: 'you are now registered you can login'})
    // req.flash('success_msg', 'You are now registered and can log in')
    res.render('login', { success})
  } catch (e) {
    console.log(e);
  }
});

//login handel
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    // failureFlash: true
  })(req, res, next);
})


//logout handel
router.get('/logout',  (req, res) => {
  req.logout((err) => {
    if(err) {
      return next(err)
    }
    res.redirect('/users/login')
  })
})

module.exports = router;
