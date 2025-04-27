const validator = require("validator");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName) {
        throw new Error("Enter a name");
    } else if (firstName.length > 25 || firstName.length < 3) {
        throw new Error("First name must be 3-25 characters");
    } else if (!lastName) {
        throw new Error("Enter a name");
    } else if (lastName.length > 25 || lastName.length < 3) {
        throw new Error("First name must be 3-25 characters");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid email");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
}

const validateLoginData = (req) => {
    const {emailId, password} = req.body;
    if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid email");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
}

module.exports = {
    validateSignUpData, validateLoginData
}