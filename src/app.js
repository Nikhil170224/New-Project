const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./model/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
    const userObj = new User(req.body);

    try {
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



