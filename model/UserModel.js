const mongoose = require("mongoose");

const UserModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
     
    },
    profileImage: {
      type: String,
    
    },
    coverImage: {
      type: String,
    
    },
    role:{
      type:String,
      default:"Blogger"
    },
    bio:{
       type:String,
       default:" i am a blogger"
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

//creating a model
const User = mongoose.model("User", UserModel);

//exporting the model
module.exports = User;
