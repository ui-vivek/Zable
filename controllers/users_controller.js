const User=require('../models/user')
const chalk=require('chalk')

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:'User-SignIn',
            profile_user:user
        })
    })
    
}

module.exports.update = function(req, res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized');
    }
}

//Render The Sign-In page
module.exports.SignIn=function(req,res){

    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:'User-SignIn'
    })
}
//Render The Sign-Up page
module.exports.SignUp=function(req,res){
    if(req.isAuthenticated()){
      return res.redirect('/users/profile');
    }
    res.render('user_sign_up',{
        title:'User-SignUp'
    })
}

//get the sign up data
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back')
    }
    User.findOne({email: req.body.email},function(err,user){
        if(err){console.log(chalk.red.inverse('Error  to find the User in the db')); return }

        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log(chalk.red.inverse('Error  to Createing User in db.')); return }

                return res.redirect('/users/sign-in')
            })
        }else{
            return res.redirect('back')
        }

    })

}
//Sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    // *****Not Working****
    // {
    //      req.logout();
    //      return res.redirect('/');
    // }
    req.session.destroy((err) => {
        return res.redirect('/users/sign-in') // will always fire after session is destroyed
      })
}
