const express = require("express")
const commentRouter = express.Router();
const commentController = require("../controller/commentController")
const verifyUser = require("../middlewares/verifyToken")


//create the comment 
//Post --> /api/v1/comments/create-comment
commentRouter.post("/create-comment/:id", verifyUser,commentController.createComment)
 
//update the comment 
// PUT --> /api/v1/comments/update-comment/:id
commentRouter.put('/update-comment/:id', commentController.updateComment);

//delete the comment 
//DELETE --> /api/v1/comments/delete-comment/:id
commentRouter.delete('/delete-comment/:id',verifyUser, commentController.deleteComment)

module.exports = commentRouter;

