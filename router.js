const Authentication = require('./controllers/authentication');

const passportService = require('./services/passport');
const passport = require('passport');

// on crée le middleware qui va intercepter les requêtes, on utilise la strat jwr et comme passport crée une session par défaut, on lui dit de ne pas le faire
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function(app) {

  //pour cette route, on passe d'abord par requireAuth puis on run la function
  app.get('/', requireAuth, function(req, res){
    res.send("hi there");
  })

  app.post('/signin',requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
