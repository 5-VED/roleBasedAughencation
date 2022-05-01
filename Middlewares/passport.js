const User = require('../Models/User');
const {SECRET} = require('../Config/index')
const {Strategy, ExtractJwt} = require('passport-jwt');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

const passportFxn = (passport) => {
    passport.use(new Strategy(opts, (payload, done) => {
        User.findById(payload.user_id).then(user => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        }).catch(err => {
            return done(null, false);
        });
    }))
}

module.exports = {
    passportFxn
}


