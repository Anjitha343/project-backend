import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify JWT and protect routes
const verifyToken = async (req, res, next) => {
  let token;
  console.log("Request Headers:", req.headers);


  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
   {
    try {
      token = req.headers.authorization.split(" ")[1];

     

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select("-password");

      return next(); 
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

export default verifyToken;
