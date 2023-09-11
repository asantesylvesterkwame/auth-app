var express = require("express");
const app = express();
var router = express.Router();
const User = require("../models/Users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

router.get("/sign-up", function (req, res, next) {
  res.render("sign-up-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    const result = await user.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
});

module.exports = router;
