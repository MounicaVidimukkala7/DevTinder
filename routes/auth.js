const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const { validateSignUpData, validateLoginData } = require("../utils/validation");


router.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        //console.log('passwordHash',passwordHash)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.status(200).json({ message: "Account created succcessfully",data: user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post("/login", async (req, res) => {
    try {
        validateLoginData(req)
        const { emailId, password } = req.body;

        // Step 1: Find user by email
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Step 2: Compare password
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            console.log('user',user)
            //* JWT token created at user model
            const token = user.getJWT();
      
            //* adding the token to cookie and send back to user
            res.cookie("token", token);
            res.status(200).json({ message: "login successful", data:user });
          } else {
            throw new Error("Invalid Credential");
          }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;