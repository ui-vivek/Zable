const User=require('../../../models/user')
const jwt=require('jsonwebtoken')

module.exports.createSession = async function(req, res){

    try{

        let user= await User.findOne({email:req.body.email});
        if(!user || user.password!=req.body.password){
            return res.json(422,{
                messasge:"Invalid Username Or Password"
            });
        }

        return res.json(200,{
            messasge:"Sign in successful , here is your token ,please keep it safe",
            data:{
                token: jwt.sign(user.toJSON(),'Zable',{expiresIn: '100000'})
            }
        })
        
    }catch(err){
        console.log('*********',err);
        return res.json(500,{
            messasge:"Internal Server Error"
        });
    }

}