const express = require('express');
const connectDB = require('../config/mongodatabase');
const User = require('../models/user');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200
    

}));
app.use(cookieParser());
//If we wont give path in ap.use it will apply for all paths
app.use(express.json()); // it is a middleware provided by express to conver req body to json if this is not there we cannot read req.body directly
app.use(express.urlencoded({ extended: true }));

const authRouter = require('../routes/auth');
app.use("/", authRouter);



connectDB().then(() => {
    console.log('Connection established successfully');
    app.listen(7777, () => {
        console.log('Server created successfully on port 7777');
    });
}).catch((err) => {
    console.error('MongoDB not connected:', err);
});