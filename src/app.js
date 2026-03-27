const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

// when you write app.use then any http method can call this api & when you dont mention the route any route can access this api
app.use(express.json());
app.use(cookieParser());
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        res.send(req.user.firstName + " Request Sent successfully!!")
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
    
})
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;      
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }


});
app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        // check weather the emailId is present in db or not
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials!!");
        }

        // if emailId is valid ==> compare the password is correct or not
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            throw new Error("Invalid Credentials!!");
        }
        
        // here this is clear that user is valid and authenticated
        // now we will create a jwt token
        const token = await jwt.sign({ _id: user._id }, "DEV@tinder$790", {expiresIn: "7d"});

        // attach the JWT token into cookie
        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 3600000 * 7),
        });
        res.send("User login succesfull !");
        
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
app.post("/signup", async (req, res) => {
    try{
        // validate the data
        validateSignupData(req);
        const {firstName, lastName, password, emailId} = req.body

        // encrypt the user password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating an instance of user model imported
        const userObj = new User({
            firstName,
            lastName,
            password: passwordHash,
            emailId
        });

        await userObj.save()
        res.send("User Data saved Succesfully!!")
    } catch (err) {
        res.status(400).send("error in saving the user:" + err.message)
    }
})

app.get("/user", async (req, res) => {
    const EmailId = req.body.emailId;

    try {
        const user = await User.find({ emailId: EmailId, lastName: req.body.lastName, firstName: req.body.firstName })
        if (user.length === 0) res.status(404).send("user not found");
        res.send(user);
    } catch (err) {
        res.status(400).send("something went wrong !!");
    }
})

app.get("/userById", async (req, res) => {
    try {
        const user = await User.findById(req.body._id);
        res.send(user);
    } catch (err) {
        res.status(400).send("something went wrong !!");
    }
})

app.delete("/user", async (req, res) => {
    try {
        await User.deleteOne({ firstName: req.body.firstName })
        res.send("user deleted successfully")
    } catch {
        res.status(400).send("something went wrong !!");
    }
})

// update a user api
app.patch("/userById", async (req, res) => {
  const { _id, ...data } = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "firstName",
      "lastName",
      "skills",
      "password",
      "gender",
      "age",
      "about",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    res.send(updatedUser);
  } catch (err) {
    res.status(400).send("UPDATE FAILED !! " + err.message);
  }
});

app.patch("/user", async (req, res) => {
    const EmailId = {emailId: req.body.emailId};
    try {
        const responce = await User.findOneAndUpdate(EmailId, req.body, { session:null});
        res.send(responce);
    } catch {
        res.status(400).send("something went wrong !!");
    }
})

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



