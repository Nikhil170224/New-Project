const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");
const {validateSignupData} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");

// when you write app.use then any http method can call this api & when you dont mention the route any route can access this api
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB() 
    .then(() => {
        console.log("Database is succesfully connected to our app!!");
        app.listen(7777, () => {
          console.log("our server is listening at port 7777");
        });
    })
    .catch((err) => {
    console.error("cannot connect to Database!!");
})



