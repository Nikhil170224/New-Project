const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  //here we write the auth logic for user, whether the api call /user is authenticated or not
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error("token not found !!!");
    }
    const decodedMsg = await jwt.verify(token, "DEV@tinder$790");
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