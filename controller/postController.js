const appErr = require("../utils/appError");
const User = require("../model/UserModel");
const Post = require("../model/PostModel");
const LoginUserId = require("../utils/LoginUserId")
const jwt = require("jsonwebtoken");

//find the token
 
exports.createPost = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
    return  res.render("newPost.ejs",{
        error:"Please fill out all fields and upload an image"
      });
    }
    console.log(req.body);
    const userId = LoginUserId(req.cookies.token);
    const userFound = await User.findById(userId);

    const PostCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userFound._id,
    });

    //push the post crated in usermodel post array

    await userFound.posts.push(PostCreated._id);
    //resave the user
    userFound.save();

    // res.status(200).json({
    //   status: "success",
    //   message: "post created successfullt",
    //   data: {
    //     PostCreated,
    //   },
    // });
    res.redirect("/api/v1/posts/fetch-all-posts");
  } catch (error) {
    return next(appErr(error.message, 500));
  }
};

exports.fetchAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user");
    // res.status(200).json({
    //   status: "success",
    //   message: "got all posts",
    //   data: {
    //     allPost,
    //   },
    // });
    console.log(posts);
     
    res.render("blog.ejs",{posts});
  } catch (error) {
    return next(appErr(error.message));
  }
};

exports.fetchSinglePost = async (req, res, next) => {
  try {
    //   const token = req.cookies.token;
    //   const decodedToken = jwt.decode(token)
    //   console.log(decodedToken);

    const postId = req.params.id;
    const postFound = await Post.findById(postId).populate("user").populate({
      path:"comments",
      populate:{
        path:"user"
        } 
    });
    console.log(postFound);
    if (!postFound) {
      return next(appErr("post not found", 401));
    }
  
    // res.status(200).json({
    //   status: "success",
    //   message: "single post found",
    //   data: {
    //     postFound,
    //   },
    // });
    res.render("postDetails.ejs",{postFound});
  } catch (error) {
    console.log(error.message);
  }
};

//update the post
exports.updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const { title, description, category } = req.body;
  try {
    //find the post
    const postFound = await Post.findById(postId);
    //checking user is owner of this post or not
    const userId = LoginUserId(req.cookies.token);
    const userFound = await User.findById(userId);
    console.log(postFound);
    if (postFound.user.toString() !== userId.toString()) {
      return next(appErr("You are not authorized to update this post ", 401));
    }

    //console.log(postFound.user.toString(),userId.toString());
    
    //create new updated post object
    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        title: title ? title : userFound.title,
        description: description ? description : userFound.description,
        category: category ? category : userFound.category,
      },
      { new: true }
    );
    return res.status(200).json({
      status: "sucess",
      message: "Post has been Updated Successfully",
      data: {
        updatePost,
      },
    });
  } catch (error) {
    return next(appErr(error.message));

  }
};

exports.deletePost = async (req,res,next) => {
  //1.fint the postid from req.params.id
  //2.find the userId using currentLoginUser
  //3.check if post belongs to current user or not 
  //4.delete the post 
  const postId = req.params.id;
  try{
    const postFound = await Post.findById(postId);
    const userId = LoginUserId(req.cookies.token);
    const userFound = await User.findById(userId);
    if(!postFound){
      return next(appErr("no post Found ",401));
    }
    if (postFound.user.toString() !== userId.toString()) {
      return next(appErr("You are not authorized to update this post ", 401));
    }
    //delete the post
    await Post.findByIdAndDelete(postId);
  
     

    // res.status(200).json({
    //   status:"success",
    //   message:"post deleted successfully"
    // })
    res.redirect("/api/v1/users/profile-page");
    

  }catch(error){
return next(appErr(error.message))
  }
}


