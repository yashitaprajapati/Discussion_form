const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,     
      emailId: user.emailId, 
      role: user.role       
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }    
  );
};

module.exports = generateToken;

