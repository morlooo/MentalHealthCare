const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const prisma = require("../model/connection");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const count = await prisma.usermaster.count({
          where: {
            OR: [{ email: email }],
          },
        });

        if (count === 0) {
          return done(null, false, { message: "Invalid username/email" });
        }

        const user = await prisma.usermaster.findFirst({
          where: {
            OR: [{ email: email }],
          },
          orderBy: {
            id: "asc",
          },
        });
        user.isAdmin = false;

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        const role = await prisma.rolemaster.findFirst({
          where: {
            name: "Admin",
          },
          orderBy: {
            id: "asc",
          },
        });

        if (role.id === user.role_id) {
          user.isAdmin = true;
        }

        return done(null, user);
      } catch (error) {
        console.error("Error fetching user from database:", error);
        return done(error);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.usermaster.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
);

module.exports = passport;
