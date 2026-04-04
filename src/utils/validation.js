const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, password, emailId } = req.body;
    if (!firstName || !lastName) {
        throw new Error('Enter full name!')
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error('Length of First name should be between 4, 50')
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error('Enter a Strong Password!')
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error('Not a valid Email!')
    }
};

const validateEditProfileData = (req) => {
    const { firstName, lastName } = req.body;
    if (firstName.length < 4 || firstName.length > 50) {
      throw new Error("Length of First name should be between 4, 50");
    } 
  //validate weather the update is allowed or not
  const allowedUpdates = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "about",
    "skills",
    "photoUrl",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedUpdates.includes(key),
  );
    if (!isUpdateAllowed) {
        throw new Error("These updates are not allowed!!");
    }
};

module.exports = {
    validateSignupData,
    validateEditProfileData
};