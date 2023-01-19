const mongoose=require('mongoose')

const postSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //Include the array of ids all the comments in this post schema
    comments:[
        {

            type:mongoose.Schema.Types.ObjectId,
            ref:'comment'
        }
    ]
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema)
module.exports=Post;