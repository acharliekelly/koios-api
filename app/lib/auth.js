// require authentication related packages
import { serializeUser, deserializeUser, use, initialize } from 'passport';
import { Strategy } from 'passport-http-bearer';

// user model will be used to set `req.user` in
// authenticated routes
import { findOne } from './models/user';

// this strategy will grab a bearer token from the HTTP headers and then
// run the callback with the found token as `token`
const strategy = new Strategy(
  function (token, done) {
    // look for a user whose token matches the one from the header
    findOne({ token: token }, function (err, user) {
      if (err) { return done(err) }
      // if we found a user, pass it along to the route files
      // if we didn't, `user` will be `null`
      return done(null, user, { scope: 'all' })
    })
  }
);

// serialize and deserialize functions are used by passport under
// the hood to determine what `req.user` should be inside routes
serializeUser((user, done) => {
  // we want access to the full Mongoose object that we got in the
  // strategy callback, so we just pass it along with no modifications
  done(null, user)
});

deserializeUser((user, done) => {
  done(null, user)
});

// register this strategy with passport
use(strategy);

// create a passport middleware based on all the above configuration
export default initialize();
