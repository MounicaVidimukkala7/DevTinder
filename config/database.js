// const mongoose = require("mongoose")
//  const connectDB = async () => {
//     await mongoose.connect("mongodb+srv://mounicavidimukkala:Scaler@199321@devtinder.jr8m3wx.mongodb.net/");
//  }

//  connectDB().then(() => {
//     console.log('Connection established successfully')
//  }).catch((err) => {
//     console.error('Not connected !!')
//  })

const { MongoClient } = require("mongodb");
const url = "mongodb+srv://mounicavidimukkala:Scaler%40199321@devtinder.jr8m3wx.mongodb.net/";
//  "mongodb+srv://mounicavidimukkala:Scaler@199321@devtinder.jr8m3wx.mongodb.net/";
const client = new MongoClient(url);

const dbName = "HelloWorld";
async function main() {
   await client.connect();
   console.log("Connected successfully to server");
   const db = client.db(dbName);
   const collection = db.collection("User");
   const data = {
      firstname: "Ranveer",
      lastname: "Singh",
      city: "Mumbai",
      phoneNumber: "987543210",
   };
   const insertResult = await collection.insertOne(data);
   console.log("Inserted documents =>", insertResult);
   // Read
   const findResult = await collection.find({}).toArray();
   console.log("Found documents =>", findResult);
   const countResult = await collection.countDocuments({});
   console.log("Count of documents in the User collection =      > ", countResult);
   // Find all documents with a filter of firstname: Deepik
   const result = await collection.find({
      firstname: "Deepika"
   }).count();
   console.log("result => ", result);
   return "done.";
}

main()
   .then(console.log)
   .catch(console.error)
   .finally(() => client.close());