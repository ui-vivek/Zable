const express=require('express')
const router=express.Router();
const user_controller=require('../controllers/user_controller')
const passport=require('passport')
router.get('/profile',passport.checkAuthentication,user_controller.user)
router.get('/sign-in',user_controller.SignIn)
router.get('/sign-up',user_controller.SignUp)
router.post('/create',user_controller.create)

//passport as a middleware to authenticate
router.post('/create-session',passport.authenticate('local',{
        failureRedirect:'/user/sign-in'
    }),
user_controller.createSession);

router.get('/sign-out', user_controller.destroySession);

module.exports=router;