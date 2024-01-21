const appErr = require("../utils/appError")
const jwt = require("jsonwebtoken")

const verifyUser = (req, res, next) => {
  const Token = req.cookies.token;
  // Make sure token exists
  if (!Token) {
    //if no token is present in the request header
    //return next(appErr("User is not logged in",401))
    return res.render("404page.ejs");
  } 
  // Verify token
    jwt.verify(Token, process.env.JWTSECRET, (err, decoded) => {
      console.log("Verifying...");
      if (err) {
      //  return res.status(500).send({ auth: false, message: err });
       return res.render("404page.ejs");
      } else {
        
        next();
      }
    });
 
};

module.exports = verifyUser;
