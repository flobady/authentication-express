const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localOptions = { usernameField: 'email' }; // ondit qu'il faudra regarder la propriété email de la requete
// create local strategy pour le login
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // verify usernme and password, call done with the user if it is correct username password
  // otherwise call done with false
  User.findOne({
    email: email
  }, function(err, user){
    if(err){ return done(err); }
    if(!user){ return done(null, false); }
    console.log("toto");
      //si on trouve user on compare les passwords
    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err) }
      if(!isMatch){ return done(null, false) }

      return done(null, user);
    })
  })

})

// Setup options for jwt strategy: cela permet de dire où se trouve le token dans les requetes qui arrivent (body, header...)
// on dit également comment déchiffrer le payload
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // si le token (qui est dans le payload) est celui d'un user qu'on connait alors le mec est authentifié --> done
  // sinon on dit non authentifié
  User.findById(payload.sub,function(err, user){
    if(err){ return done(err, false); }
    if(user){
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

