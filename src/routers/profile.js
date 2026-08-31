const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //validate all data in req.body

    //validate weather the update is allowed or not
    validateEditProfileData(req);

    await Object.keys(req.body).forEach(key => req.user[key] = req.body[key]);
    req.user.save();
    res.json({data: req.user});

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async(req,res)=>{
  try {
    // user will send the prev password and the new password
    // we will check if the prev password is equal to req.user.password ==> either we will throw new error or update the password using bcrypt
    const { prevPassword, newPassword } = req.body;
    const isprevPasswordCorrect = await bcrypt.compare(prevPassword, req.user.password);
    if (!isprevPasswordCorrect) {
      throw new Error(`Oops! ${prevPassword} is wrong password!!`);
    }
    validateEditProfileData({
      body: { password: req.body.newPassword }
    });
    const newpasswordHash = await bcrypt.hash(newPassword, 10);
    req.user.password = newpasswordHash;
    req.user.save();
    res.send("New password updated succesfully!!");

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
})

// what if i dont know my prevPassword, i forgot that
// then we will give the emailId => if emailId is correct then => we will send otp on the email id
// second api to verify the otp => if otp is correct then only password will be updated O.W. => throw new Error

module.exports = profileRouter;