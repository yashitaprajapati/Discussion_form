const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) { 

        return res.status(401).json({ message: "No token provided" });
    }

    const token = authorization.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { userId } = user;
        const userFind = await User.findById(userId);

        if (!userFind) {
            return res.status(404).json({ message: "User Not Found" });
        }

        req.user = {
            id: userFind._id,
            emailId: userFind.emailId,
            role: userFind.role  // 👈 confirm ho gaya
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized User" });
    }
};

module.exports = { authMiddleware };