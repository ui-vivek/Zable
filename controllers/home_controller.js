// module.exports.actionName=function(req,res){----}
module.exports.home=function(req,res){
    console.log(req.cookies);
    // res.cookie('user',2)
    return res.render('home',{title:'Zable'})
}