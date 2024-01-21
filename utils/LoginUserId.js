
const jwt = require("jsonwebtoken")

const LoginUserId = (token) => {
    const decodedtoken = jwt.decode(token);
  
    return decodedtoken.id;
  };

  module.exports = LoginUserId;

  