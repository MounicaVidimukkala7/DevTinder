const mongoose = require("mongoose")
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://mounicavidimukkala:Scaler%40199321@devtinder.jr8m3wx.mongodb.net/Tinder");
}

module.exports = connectDB
