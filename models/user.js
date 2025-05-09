const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: [25, "First name too long"],
        match: /^[a-zA-Z]+$/
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: [25, "Last name too long"],
        match: /^[a-zA-Z]+$/
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: "Invalid email address"
        },
        lowercase: true,
        trim: true,
        minLength: [3, "Email too small"],
        maxLength: [30, "Email too large"],
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: "Password is not strong",
        }
    },
    photoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isURL(value);
            },
            message: "Give string is not an URL",
        },
    },
    skills: {
        type: [String],
        validate: {
            validator: function () {
                return this.skills.length < 16;
            },
            message:
                "Too many skills, make number of skills less than or equal to 15",
        },
    },
    dateOfBirth: {
        type: Date,
        // need to add minimum zero year old and max 150 years
    },
    age: {
        type: Number,
        get: function () {
            if (!this.dateOfBirth) return null;
            const diff = Date.now() - this.dateOfBirth.getTime();
            return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
        },
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    role: {
        type: String,
        enum: ["admin", "moderator", "user"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "deactivated", "banned"],
        default: "active",
    },
    about: {
        type: String,
        validate: {
            validator: (value) => {
                return value.length < 100
            },
            message: "Enter small text"
        }

    }
},
    { timestamps: true })

userSchema.methods.getJWT = function () {
    const token = jwt.sign({ _id: this._id }, "secretToken", {
        expiresIn: "3d",
    });
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;