//PASSPORT RELATED INFORMATION
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Replace this with your actual user store or database
const users = [];

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => { //authenticate function; done: called when done authenticating user
    const user = getUserByEmail(email);
    if (user == null) { // 1. check if we have a user
      return done(null, false, { message: 'No user with that email' }); //(error{none on server}, found no user, error message)
    }

    try { //check if pw matches user
      if (await bcrypt.compare(password, user.password)) { //compare user & pw
        return done(null, user); //if user found (return no error, but user)
      } else {
        return done(null, false, { message: 'Password incorrect' }); //if user not found
      }
    } catch (e) { // (e=error)
      return done(e); //error of application
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => { //serialize our user: to store into session
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => { //deserialize our user: serialize our user as a single ID
    const user = getUserById(id);
    done(null, user);
  });
}

module.exports = initialize;