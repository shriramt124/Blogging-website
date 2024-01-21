const Comment = require("../model/commentModel");
const Post = require("../model/PostModel");
const LoginUserId = require("../utils/LoginUserId");
const appErr = require("../utils/appError")
const User = require("../model/UserModel")
//create comment
exports.createComment = async (req, res, next) => {
  //1.find out in which post i want to do the comment
  //2.create the comment
  //3.push the comment in post array
  const { message } = req.body;
  try {
    console.log(message);
    const postFound = await Post.findById(req.params.id);
    const userId = LoginUserId(req.cookies.token);
    const userFound = await User.findById(userId);
    if (!userFound) {
      return next(appErr("you are not allowed to comment", 401));
    }

    if (!postFound)
      return res.status(404).json({ msg: "No post found with this id" });
    const commentCreated = await Comment.create({
      message,
      user: userFound._id,
      post: postFound._id,
    });
    //push comment in post
    postFound.comments.push(commentCreated._id);

    //push in user also
    userFound.comments.push(commentCreated._id);

    //disable the validation also before saving it

    postFound.save({ validateBeforeSave: false });
    userFound.save({ validateBeforeSave: false });
    // res.status(200).json({
    //   status:'success',
    //  data:commentCreated
    // })
    res.redirect(`/api/v1/posts/fetch-single-post/${postFound._id}`);
  } catch (error) {
    return next(appErr(error.message));
  }
};

//updatecomment
exports.updateComment = async (req, res, next) => {
  const commentId = req.params.id;
  const { message } = req.body;
  try {
    const commentFound = await Comment.findById(commentId);
    const userId = LoginUserId(req.cookies.token);
    if (commentFound.user.toString() !== userId.toString()) {
      return next(appErr("You are not allowed to update this comment", 403));
    }
    commentFound.message = message;
    await commentFound.save();
    res.status(200).json(commentFound);
  } catch (error) {}
};

//delete comment
exports.deleteComment = async (req, res, next) => {
  const commentId = req.params.id;
  console.log(req.query);
  try {
    const commentFound = await Comment.findById(commentId);
    if (!commentFound) {
      return next(appErr("comment not found", 403));
    }
    //checking the owner of the comment
    let userId = LoginUserId(req.cookies.token);
    if (userId.toString() !== commentFound.user.toString()) {
      return next(appErr("you do not have permission for this action", 401));
    }
    //delete the comment finally
    const deletedComment = await Comment.findByIdAndDelete(commentId);
        res.redirect(`/api/v1/posts/fetch-single-post/${req.query.postId}`);
    
  } catch (error) {
    return next(appErr(error.message));

  }
};

