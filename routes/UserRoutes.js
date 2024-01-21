const express = require("express");
const UserRoutes = express.Router();
const userController = require("../controller/userController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const verifyUser = require("../middlewares/verifyToken");
const storage = require("../config/cloudinary");
const multer = require("multer");
const postController = require("../controller/postController")

const upload = multer({ storage });
 

 
UserRoutes.get("/login",async(req,res)=>{
res.render("login.ejs",{
  error:""
})
})
 
UserRoutes.get("/register",async(req,res)=>{
res.render("register.ejs",{
  error:""
})
})
 
UserRoutes.get("/blogs-all",async (req,res)=>{
     res.render("blog.ejs");
})

UserRoutes.get("/upload-profile-photo-form",async(req,res)=>{
  res.render("uploadProfilePhoto.ejs",{
    error:""
  })
})
UserRoutes.get("/upload-cover-photo-form",async(req,res)=>{
  res.render("uploadCoverPhoto.ejs",{
    error:""
  });
})


 

//POST -> /api/v1/users/addNewUser
UserRoutes.post("/register", userController.addNewUser);

//POST --> /api/v1/users/login
UserRoutes.post("/login", userController.signin);

//GET --> /api/v1/users/blogs
UserRoutes.get("/blogs",verifyUser,postController.fetchAllPosts);

//GET--> /api/v1/users/:id
UserRoutes.get("/profile-page", verifyUser, userController.ProfilePage);
UserRoutes.put("/update/:id", verifyUser, userController.updateUser);

UserRoutes.put(
  "/profile-photo-upload",
  verifyUser,
  upload.single("profile"),
  userController.uploadProfilePhoto
);

UserRoutes.put(
  "/cover-photo-upload",
  verifyUser,
  upload.single("profile"),
  userController.uploadCoverPhoto
);

//GET --> /api/v1/users/getAllUser
UserRoutes.get("/",verifyUser,userController.getAllUsers);

/* UserRoutes.delete(userController.removeUser);*/
module.exports = UserRoutes;
