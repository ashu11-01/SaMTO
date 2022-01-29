const passport = require('passport')
const user = require('../models/user-model')
const jwt = require('jsonwebtoken')
const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt
require('dotenv').config()

// passport.use(user.createStrategy())
// passport.serializeUser(user.serializeUser())
// passport.deserializeUser(user.deserializeUser())

const options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new jwtStrategy(options, (jwt_payload, done) => {
        user.findById(jwt_payload._id, (err, user) => {
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            }
            else {
                return done(null, false)
            }
        })
    }))

exports.passport = passport
exports.getToken = (user) => jwt.sign(user.toJSON(), process.env.JWT_SECRET, {expiresIn: 300})
exports.verifyToken = (token) => jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err)
        return err
    else return decoded
})
exports.verifyUser = passport.authenticate('jwt', {session : false})