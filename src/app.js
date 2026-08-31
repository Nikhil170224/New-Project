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
const userRouter = require("./routers/user");
const cors = require("cors");


app.use(express.json());
// when you write app.use then any http method can call this api & when you dont mention the route any route can access this api
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}
));
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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



