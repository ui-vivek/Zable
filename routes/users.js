const express=require('express')
const router=express.Router();
const users_controller=require('../controllers/users_controller')
const passport=require('passport')
router.get('/profile/:id',passport.checkAuthentication,users_controller.profile)
router.post('/update/:id',passport.checkAuthentication,users_controller.update)

router.get('/sign-in',users_controller.SignIn)
router.get('/sign-up',users_controller.SignUp)
router.post('/create',users_controller.create)

//passport as a middleware to authenticate
router.post('/create-session',passport.authenticate('local',{
        failureRedirect:'/users/sign-in'
    }),
users_controller.createSession);

router.get('/sign-out', users_controller.destroySession);

module.exports=router;