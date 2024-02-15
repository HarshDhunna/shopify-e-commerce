// config/passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../Models/User");
const cookieExtractor = require("../common/cookieExtarctor");

passport.use(
  new LocalStrategy({ usernameField: "email", session: false }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "No such user" });
      }

      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (err) {
      console.error(err);
      return done(err);
    }
  })
);

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: "harsh", // Replace with your actual secret key
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);
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

module.exports = passport;
