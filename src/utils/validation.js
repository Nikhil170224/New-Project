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
  const allowedUpdates = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "password",
    "about",
    "skills",
    "photoUrl",
  ];

  const updates = Object.keys(req.body);

  // Check if all requested fields are allowed
  const isUpdateAllowed = updates.every((field) =>
    allowedUpdates.includes(field),
  );

  if (!isUpdateAllowed) {
    throw new Error("Invalid update fields");
  }

  // Validate only fields that are present

  if ("firstName" in req.body) {
    if (
      typeof req.body.firstName !== "string" ||
      req.body.firstName.trim().length < 4 ||
      req.body.firstName.trim().length > 50
    ) {
      throw new Error("First name must be between 4 and 50 characters");
    }
  }

  if ("lastName" in req.body) {
    if (
      typeof req.body.lastName !== "string" ||
      req.body.lastName.trim().length < 2 ||
      req.body.lastName.trim().length > 50
    ) {
      throw new Error("Last name must be between 2 and 50 characters");
    }
  }

  if ("age" in req.body) {
    if (
      !Number.isInteger(req.body.age) ||
      req.body.age < 18 ||
      req.body.age > 100
    ) {
      throw new Error("Invalid age");
    }
  }

  if ("gender" in req.body) {
    const allowedGenders = ["male", "female", "other"];

    if (!allowedGenders.includes(req.body.gender.toLowerCase())) {
      throw new Error("Invalid gender");
    }
    }
    if ("password" in req.body) {
        if (!validator.isStrongPassword(req.body.password)) {
            throw new Error("Enter a Strong Password!");
        }
    }

  if ("about" in req.body) {
    if (req.body.about.length > 500) {
      throw new Error("About section cannot exceed 500 characters");
    }
  }

  if ("skills" in req.body) {
    if (!Array.isArray(req.body.skills)) {
      throw new Error("Skills must be an array");
    }
  }

  if ("photoUrl" in req.body) {
    if (!validator.isURL(req.body.photoUrl)) {
      throw new Error("Invalid photo URL");
    }
  }
};

module.exports = {
    validateSignupData,
    validateEditProfileData
};