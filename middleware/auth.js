const adminAuth = app.use("/admin", (req, res, next) => {
  //here we write the auth logic for admin, whether the api call /admin is authenticated or not
  //the server should only respond if actual admin is making api call and doesnot respond if some hacker is mimicing the admin
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(404).send("unauthrized request!");
  } else {
    console.log("Admin authenticated successfully!!");
    next();
  }
});

const userAuth = app.use("/user", (req, res, next) => {
  //here we write the auth logic for user, whether the api call /user is authenticated or not
  //the server should only respond if actual user is making api call and doesnot respond if some hacker is mimicing the user
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(404).send("unauthrized request!");
  } else {
    console.log("User authenticated successfully!!");
    next();
  }
});

module.exports ={
  adminAuth,
  userAuth
}