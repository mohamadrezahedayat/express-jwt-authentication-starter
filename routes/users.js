const mongoose = require('mongoose');
const router = require('express').Router();
const User = mongoose.model('User');
const passport = require('passport');
const utils = require('../lib/utils');

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    console.log('here');
    console.log(req.headers.authorization);
    res.status(200).json({ success: true, msg: 'you are authorized!' });
  }
);

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(401).json({ success: false, msg: 'could not find user!' });
      }
      const isValid = utils.validPassword(password, user.hash, user.salt);
      if (isValid) {
        const { token, expires } = utils.issueJWT(user);
        res.status(200).json({ success: true, user, token, expires });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'You entered wrong password!' });
      }
    })
    .catch((err) => next(err));
});

router.post('/register', function (req, res, next) {
  const { salt, hash } = utils.genPassword(req.body.password);
  const { username } = req.body;
  const newUser = new User({ username, hash, salt });
  newUser
    .save()
    .then((user) => {
      const { token, expires } = utils.issueJWT(user);
      res.json({ success: true, user, token, expires });
    })
    .catch((err) => next(err));
});

module.exports = router;
