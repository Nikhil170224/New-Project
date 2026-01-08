const express = require("express");

const app = express();
app.use("/user", (req, res) => {
    res.send("haaaahaha");
})
app.get("/user", (req, res) => {
    res.send({ firstName: "akshai", lastName: "Saini" })
})

app.post("/user", (req, res) => {
    res.send("Data Stored Successfully");
})

app.delete("/user", (req, res) => {
  res.send("Data Deleted Successfully");
});

app.use("/", (req, res) => {
    console.log("event handler 1");
    res.send("Namaste Node Js!!");
})

app.listen(7777, () => {
    console.log("our server is listening at port 7777");
});