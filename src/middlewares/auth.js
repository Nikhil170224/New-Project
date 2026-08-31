const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config()

const userAuth = async (req, res, next) => {
  //here we write the auth logic for user, whether the api call /user is authenticated or not
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send("Please Login!!");
    }
    const decodedMsg = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!!");
    }
    req.user = user;
    next();
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
}

module.exports ={
  userAuth
}