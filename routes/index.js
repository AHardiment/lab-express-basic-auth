const express = require("express");
const router = express.Router();
const User = require("./../models/User.model");
const bcryptjs = require("bcryptjs");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/log-in", (req, res, next) => {
  res.render("log-in");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

router.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hashAndSalt) => {
      User.create({
        username,
        passwordHashAndSalt: hashAndSalt,
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect("/");
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/log-in", (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((userDocument) => {
      user = userDocument;
      if (user) {
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      } else {
        return false;
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect("/main");
      } else {
        res.redirect("/log-in");
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/log-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
