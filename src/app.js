const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("middleware/auth.js");

app.use("/admin", adminAuth);

// app.get("/user/:userid/:password/:city/:firm/:role", (req, res) => {
//     console.log(req.params);
//     res.send({ firstName: "akshai", lastName: "Saini" })
// })

app.get("/user", userAuth, (req, res) => {
    res.send("User data Sent!!");
})

app.get("/admin/getAllData", (req, res) => {
    res.send("All Data Sent Successfuly")
})

app.delete("/admin/deleteData", (req, res) => {
  res.send("Data deleted Successfuly");
});

app.listen(7777, () => {
    console.log("our server is listening at port 7777");
});