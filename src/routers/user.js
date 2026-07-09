const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const connectionRequests = require("../model/connectionRequest");
const User = require("../model/user");

const SAFE_DATA = "firstName lastName age gender photoUrl";
// user/request/received

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        
        const connectionRequest = await connectionRequests.find({
            ToUserId: loggedInUser._id,
            status: "interested"
        }).populate("FromUserId", SAFE_DATA);

        res.json({
            message: "These are all the connection request received, but not answered!",
            Connection_Request: connectionRequest
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
            Conn: data
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {      
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit > 50) ? 50 : limit;
        const skip = (page - 1) * limit;

        const UserConnectionRequests = await connectionRequests.find({
            $or: [{ FromUserId: loggedInUser._id }, { ToUserId: loggedInUser._id }]
        }).select("FromUserId ToUserId");
        
        const hiddenUsers = new Set();
        UserConnectionRequests.forEach((request) => {
            hiddenUsers.add(request.FromUserId.toString());
            hiddenUsers.add(request.ToUserId.toString());
        });

        const feed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUsers) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
            .select(SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.send({
            Message: "This is your Feed",
            Feed: feed
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;