const User = require("../model/UserModel");
const appErr = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../model/PostModel")
const LoginUserId = require("../utils/LoginUserId")



exports.addNewUser = async (req, res, next) => {
  //1.get {username,email,password,cnfpassword} from req.body
  //2.check if every field is provided or not
  //3.check if password matched or not if not then throw error that password not mathced
  //4.generate salt before saving the password
  //5.bcrypt the password
  //6.return message that it is sucessfull
  let { username, email, password, confirmPassword,bio } = req.body;
  try {
    if (!username || !email || !password || !confirmPassword) {
      // const err = appErr("all fields are required", 500);
      // return next(err);
      return res.render("register.ejs",{
        error:"all fields are required"
      })
    }

    if (password !== confirmPassword) {
      //return res.status(400).json({ message: "Password doesnot match" });
      // let err = appErr("password does not match", 500);
      // return next(err);
      return res.render("register.ejs",{
        error:"password does not match"
      })
    }

    let user = await User.findOne({ email: email });

    if (user){
     //  return  res.status(400).json({ message:"Email already in use" })
       return res.render("register.ejs",{
        error:"password already not match"
      })
      };

    const salt = await bcrypt.genSalt(10);

    password = await bcrypt.hash(password, salt);

    let newUser = await User.create({

      username,
      email,
      password,
      bio:req.body.bio ? bio:""

    });
     
   /*  res.status(200).json({
      status: "success",
      message: "you are successfully registered",
      data: {
        newUser,
      },
    }); */
   res.redirect("/api/v1/users/login");
  } catch (error) {
   // return next(appErr(error.message, 500));
    return res.render("404page.ejs");
  }
};

exports.signin = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    if (!email || !password) {
     // return next(appErr("", 400));
     return res.render("login.ejs",{
        error:"all fields are required"
      })
    }

    const userFound = await User.findOne({ email });

    if (!userFound) {
   //   return next(appErr("user not found Please register", 401));
      return res.render("login.ejs",{
        error:"user not found Please register"
      })
    }

    const isValidPassword = await bcrypt.compare(password, userFound.password);

    if (!isValidPassword) {
    //  return next(appErr("password is not valid ", 401));
      return res.render("login.ejs",{
        error:"password is not valid "
      })
    }

    //store it in token
    const Token = jwt.sign({ id: userFound._id }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });

    console.log(Token);
    res.cookie("token", Token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
    console.log(res.cookie);

 /*    res.status(200).json({
      status: "success",
      message: "you are successfully logged in",
      data: {
        userFound,
      },
    });  */
   res.redirect("/api/v1/users/blogs");
  } catch (error) {
   // return next(appErr(error.message, 500));
   res.render("404page.ejs");
  }
};

exports.getBlogsPage = async(req,res,next) => {
  /* 
  1.find the all the Users with theie blogs and post
  */
  try{
    const allPosts = await Post.find().populate("user");
    console.log(allPosts);
    res.status(200).json({
      data:"success",
      data:{
        allPosts
      }
    })
  }catch(error){
   res.render("404page.ejs")
  }
}
exports.ProfilePage = async (req, res, next) => {
  //1.get id from req.params.id
  //1.find the user using id
  //2.get the token using  = req.cookie.token
  //3.verify the token using jwt verify
  //4.find the user

  try {
 
    const Userid =  LoginUserId(req.cookies.token);

    const userFound = await User.findById(Userid).populate('posts').populate("comments");
     
    if (!userFound) {
      return next(appErr("user not found", 400));
    }
    console.log(userFound);
    
    // res.status(200).json({
    //   status: "succes",
    //   data: {
    //     userFound,
    //   },
    // });
    res.render("profile.ejs",{userFound});
  } catch (error) {
    //return next(appErr(error.message, 500));
    res.render("404page.ejs")
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = LoginUserId(req.cookies.token);
   const { username, email } = req.body;
  try {
      
     const UserFound = await User.findById(userId);
     if (!UserFound) {
       return next(appErr("user not found", 401));
    }
     await User.findByIdAndUpdate(userId,
       {
        username: username ? username : UserFound.username,
        email: email ? email : UserFound.email,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
       status:"success",
       message:"successfully updated username and email",
       
    })
  } catch (error) {
    return next(appErr(error.message,500));
  }
};

exports.getAllUsers = async (req,res,next) => {
        try{
          const AllUsers = await User.find().populate("Post");
          return res.status(200).json({
            status:"success",
            data:{
              AllUsers
            }
          })
        }catch(error){
             return next(appErr(error.message,500));
        } 
}

exports.uploadProfilePhoto = async(req,res,next)=>{
  try{
    if(!req.file){
      return next(appErr("profile photo is required",401));
    }
     const userId = LoginUserId(req.cookies.token);
     const userFound = await User.findById(userId)
     if(!userFound){
      return next(appErr("error in upload profile photo",401));
     }
     
     const updatedUser=  await User.findByIdAndUpdate(userId,{
      profileImage:req.file.path
     },{
      new:true
     })

    //  return res.status(200).json({
    //   status:"success",
    //   message:"profile photo updated successfully",
    //   data:{
    //     updatedUser
    //   }
    //  })
    res.redirect("/api/v1/users/profile-page");
  }catch(error){
    return next(appErr(error.message,500))
  }
}

exports.uploadCoverPhoto = async (req,res,next) => {
  try{
  if(!req.file){
    return next(appErr("cover photo is required",401))
  }
  const userId = LoginUserId(req.cookies.token);
  const userFound = await User.findById(userId)
  if(!userFound){
    return next(appErr("error in upload profile photo",401));
   }
   const updatedUser = await User.findByIdAndUpdate(userId,{
    coverImage:req.file.path
   },{new:true})
  //  return res.status(200).json({
  //   status:"success",
  //   message:"profile photo updated successfully",
  //   data:{
  //     updatedUser
  //   }
  //  })
  res.redirect("/api/v1/users/profile-page")
  }catch(error){
    return next(appErr(error.message,500))
  }
}
 
exports.logoutUser = async (req,res,next) => {
  try{
  //destroy session
  res.clearCookie('token');
  res.redirect("/api/v1/users/login");
  
  }catch(error){
    return res.render("404page.ejs");
  }
}
