const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const connectionRequests = require("../model/connectionRequest");

const SAFE_DATA = "firstName lastName age gender photoUrl";
// user/request/received

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        
        const connectionRequests = await connectionRequests.find({
            ToUserId: loggedInUser._id,
            status: "interested"
        }).populate("FromUserId", SAFE_DATA);

        res.json({
            message: "These are all the connection request received, but not answered!",
            Connection_Request: connectionRequests
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

//here we as a user need to get all the connections we have till right now which have status == accepted
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const Connections = await connectionRequests.find({
            $or: [
                { FromUserId: loggedInUser._id, status: "accepted" },
                { ToUserId: loggedInUser._id, status: "accepted" }
            ],
        }).populate("FromUserId", SAFE_DATA).populate("ToUserId", SAFE_DATA);


        const data = Connections.map((row) => {
            const { FromUserId, ToUserId } = row;
            if ((FromUserId._id).equals(loggedInUser._id)) {
                return ToUserId;
            }
            return FromUserId;
        })
        
        res.json({
            message: "These are all the connections you have",
            Connections: data
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;