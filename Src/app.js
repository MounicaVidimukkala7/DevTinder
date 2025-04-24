const express = require('express');

const app = express();

app.use("/home", function (req, res) {
    res.send('Dashboard')
});

app.use("/", function (req, res) {
    console.log(req)
    res.send('tell me home')
});

app.listen(7777, () => {
    console.log('Server created successfully')
})