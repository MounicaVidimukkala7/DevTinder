const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        res.status(401).send("Please Login!")
    }
    const decodedObject = await jwt.verify(token, 'secretToken');
    const { _id } = decodedObject;
    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }
    req.user = user;
    next();

}

module.exports = {userAuth}