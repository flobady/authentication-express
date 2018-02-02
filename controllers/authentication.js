const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)    //sub et iat par convention iat =issued at time
}

exports.signup = function(req, res, next) {

  if(!req.body.email || !req.body.password) {
    return res.status(422).send({error: "Please provide email and password"});
  }

  User.findOne({
    email: req.body.email
  }, (err, existingUser) => {

    if(err) { return next(err); }

    if(existingUser){
      return res.status(422).send({error: "Email is in use"});
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    user.save( err => {
      if(err){ return next(err)}
        res.json({token: tokenForUser(user)})
    })
  });
}

exports.signin = function(req, res, next){
  //le user a déjà son email et password validé, on lui donne juste son token
  res.send({token: tokenForUser(req.user)});
}
