const mongoose = require("mongoose")

const PostModel = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type: String,
        default:"",
        required:true
    },
    category:{
        type:String,
        enum:["Web development","web design","Article","css","javascript","react js"],
        required:true,

    },
    image:{
        type:String,
        required:true,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},{
    timestamps:true
})

//modelling hte post 
const Post= mongoose.model("Post",PostModel)

module.exports = Post;
