const express = require("express")
const postRoutes = express.Router()

const postController =require("../controller/postController")
const storage = require("../config/cloudinary");
const multer = require("multer")
const verifyUser = require("../middlewares/verifyToken")


const upload = multer({storage})

postRoutes.get("/new-post",async(req,res)=>{
    res.render("newPost.ejs",{
        error:"",
         
    });
  })
//create post 
postRoutes.post("/create-post",verifyUser,upload.single("file"),postController.createPost);
//Fetch all posts
postRoutes.get("/fetch-all-posts",verifyUser,postController.fetchAllPosts);

//fetch single post with id 
postRoutes.get("/fetch-single-post/:id",verifyUser,postController.fetchSinglePost);


//update the post 
postRoutes.put("/update-post/:id",verifyUser,upload.single("file"),postController.updatePost);

//delete the post
postRoutes.delete("/delete-post/:id",verifyUser,postController.deletePost);

module.exports = postRoutes;