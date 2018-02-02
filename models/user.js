const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');


// define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true},  // on met lowercase pour que STEPHEN@gmail.com et stephen@gmail.com soit considéré comme identique
  password: String
})


// on save hook, encrypt password
// before saving a mddel, run this function
userSchema.pre('save', function(next){
  //get taccess to the user model
  const user = this;

  //generate a salt then run call back
  bcrypt.genSalt(10, function(err, salt){

    if(err){ return next(err); }

    //hash (ie encrypt) our password using this salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){ return next(err); }

      // override plain text with encrypted password
      user.password = hash;
      next();
    });
  });
});

// dés qu'on crée un user model, il a accés à cette methode. on compare entre le password crypté de la db et le password inséré par le user qu'on crypte à la volée. on compare les password cryptés.
userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){ return callback(err);}
    callback(null, isMatch);
  });
}

// create the model class
const ModelClass = mongoose.model('user',userSchema);

//export the class
module.exports = ModelClass;
