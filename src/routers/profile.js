const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const {validateEditProfileData} = require("../utils/validation.js");

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
    res.send("user updated Succesfully!!");

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/forgetPassword", userAuth, async(req,res)=>{
  try {
    
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
})

module.exports = profileRouter;