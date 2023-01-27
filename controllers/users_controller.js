const User=require('../models/user')
const chalk=require('chalk');
const fs=require('fs')
const path=require('path')

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:'User-SignIn',
            profile_user:user
        })
    })
    
}

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
        
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){console.log("*********Multer Error :",err)};

                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar))
                    }

                    // this is saving the path of the uploaded file into avatar field in the user
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back')
            })
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized !')
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
        req.flash('error', 'Passwords do not match');
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
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back')
        }

    })

}
//Sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in Succesfully')
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    // *****Not Working****
    // {
    //      req.logout();
    //      return res.redirect('/');
    // }
    req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You have Logged out');
    return res.redirect('/');
    });
}