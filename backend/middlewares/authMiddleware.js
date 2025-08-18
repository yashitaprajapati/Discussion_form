const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
const authMiddleware = async (req,res,next)=>{
    
    const { authorization} = req.headers; 
    const token = authorization.split(" ")[1];

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!user){
        res.status(401).json({
            message: "Unauthorized User"
        })
    }
    const { _id}  = user.userId;
    const userFind = await User.find({_id});

    
    if(userFind.length==0){
        res.status(404).json({
            message: "User Not Found"
        })
    }
    
    req.user = userFind;
    
    next();
}


module.exports = { authMiddleware};