const express = require('express');
const connectDB = require('../config/mongodatabase');
const User = require('../models/user');

const app = express();
//If we wont give path in ap.use it will apply for all paths
app.use(express.json()); // it is a middleware provided by express to conver req body to json if this is not there we cannot read req.body directly
app.use(express.urlencoded({ extended: true }));

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send('User created successfully');
    } catch (err) {
        res.status(400).json({ message: 'Creation failed', error: err.message });
    }
});

connectDB().then(() => {
    console.log('Connection established successfully');
    app.listen(7777, () => {
        console.log('Server created successfully on port 7777');
    });
}).catch((err) => {
    console.error('MongoDB not connected:', err);
});