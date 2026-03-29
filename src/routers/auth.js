const express = require("express");
const authRouter = express.Router();
const User = require("../model/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignupData(req);
    const { firstName, lastName, password, emailId } = req.body;

    // encrypt the user password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating an instance of user model imported
    const userObj = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });

    await userObj.save();
    res.send("User Data saved Succesfully!!");
  } catch (err) {
    res.status(400).send("error in saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        // check weather the emailId is present in db or not
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials!!");
        }

        // if emailId is valid ==> compare the password is correct or not
        const isCorrectPassword = await user.validatePassword(password);
        if (!isCorrectPassword) {
            throw new Error("Invalid Credentials!!");
        }
        
        // here this is clear that user is valid and authenticated
        // now we will create a jwt token
        const token = await user.getJWT();

        // attach the JWT token into cookie
        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 3600000 * 7),
        });
        res.send("User login succesfull !");
        
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = authRouter;

