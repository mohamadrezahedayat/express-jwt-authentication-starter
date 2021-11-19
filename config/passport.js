const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');
const { Strategy, ExtractJwt } = require('passport-jwt');
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
/*
 const passportJWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY || 'secret phrase',
  issuser: 'enter is user here',
  audience: 'enter audience here',
  algorithms: ['RS256'],
  ignoreExpiration: false,
  passReqToCallback: false,
  jsonWebTokenOption: {
    complete: false,
    clockTolerance: '',
    maxAge: '2d',
    clockTimestamp: '100',
    nonce: 'string here for openId',
  },
};
 */

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const strategy = new Strategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) return done(null, user);
      return done(null, false);
    })
    .catch((err) => done(err, null));
});

module.exports = (passport) => {
  passport.use(strategy);
};
