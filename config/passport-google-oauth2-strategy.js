const passport=require('passport')
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');


passport.use(new googleStrategy({
        clientID:"569961070399-k1r78vudtqlbrto64soja1qp064cg0h8.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log("Error in Google strategy passport",err);return;}
            console.log(profile);
            
            if(user){
                return done(null,user);
            }else{
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log("Error in Google strategy passport",err);return;}

                    return done(null,user);
                })
            }
        })
    }
))


module.exports=passport;