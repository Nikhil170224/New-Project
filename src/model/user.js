const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50
  },
  lastName: {
      type: String,
      maxLength: 15
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
      validate(value) {
          if (!validator.isEmail(value)) {
              throw new Error("Not a valid Email: " + value);
          }
      }
  },
  password: {
    type: String,
      required: true,
      validate(val) {
          if (!validator.isStrongPassword(val)) {
              throw new Error("not a Strong password: " + val);
        }
    }
  },
  age: {
      type: Number,
      min: 1,
      max: 100
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Gender data is not valid !!");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
          "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_rp_progressive&w=740&q=80",
      validate(value) {
          if (!validator.isURL(value)) {
              throw new Error("Not a valid URL: " + value);
        }
    }
  },
  about: {
    type: String,
    default: "This is the default about section of user",
  },
  skills: {
    type: [String],
  },
},
{
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;