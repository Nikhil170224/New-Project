const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://codenik72_db_user:uBOYDYWScesIXfPR@cluster0.jgejjl6.mongodb.net/DevTinder"
    );
}

module.exports= connectDB
