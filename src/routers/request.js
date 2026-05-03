const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const connectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");

requestRouter.post("/request/send/:status/:ToUserId", userAuth, async (req, res) => {
  try {
    const ToUserId = req.params.ToUserId;
    const FromUserId = req.user._id;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type !" });
    }

    // ✅ Validate ToUserId is a valid ObjectId BEFORE hitting the DB
    if (!mongoose.Types.ObjectId.isValid(ToUserId)) {
      return res.status(400).json({ message: "Invalid user ID format!" });
    }

    const toUser = await User.findById(ToUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found !" });
    }

    const existingRequest = await connectionRequestModel.findOne({
      $or: [
        { ToUserId, FromUserId },
        { ToUserId: FromUserId, FromUserId: ToUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "This Request already exists" });
    }

    const connectionRequest = new connectionRequestModel({
      ToUserId,
      FromUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName + " " + status + " " + toUser.firstName,
      connectionRequest: data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ['accepted', 'rejected'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "status not valid!" });
    }

    const connectionRequest = await connectionRequestModel.findOne({
      _id: requestId,
      ToUserId: logedInUser._id,
      status: 'interested'
    })

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request Not found !" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({
      message: "Connection Request " + status + " successfully !",
      data: data
    });
  }
  catch(error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = requestRouter;