const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");

app.post("/signup", async(req, res) => {
    const userObj = new User({
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "virat@kohli.com",
        age: "28",
        gender: "male"
    })

    try {
        await userObj.save()
        res.send("User Data saved Succesfully!!")
    } catch (err) {
        res.status(400).send("error in saving the user:" + err.message)
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



