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

module.export = validateSignupData;