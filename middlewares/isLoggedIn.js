const appErr = require("../utils/appError")

let isLoggedIn = async (req,res,next)=> {
  
      //take the token from coookie
      
      if(req.cookies.token){
        next();
      }
       else{
        return next(appErr("user is not logged in",404));
       }
}

module.exports = isLoggedIn;