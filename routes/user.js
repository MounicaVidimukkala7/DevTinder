const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
// Get all the pending connection request for the loggedIn user
router.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);
        console.log(connections)
        if (!connections) {
            return res.status(400).json({ message: "No recieved connections are present" })
        }
        res.json({
            message: "Data fetched successfully",
            data: connections,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get("/user/connections", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const connectionRequests = await ConnectionRequest.find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
        .populate("fromUserId", ["firstName","lastName"])
        .populate("toUserId", ["firstName","lastName"]);
  
      console.log(connectionRequests);
  
      const data = connectionRequests.map((row) => {
        if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return row.toUserId;
        }
        return row.fromUserId;
      });
  
      res.json({ data });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });
  router.get("/feed", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  console.log("loggedInUser",loggedInUser)
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  console.log('hideUsersFromFeed',hideUsersFromFeed)
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
        .select(["firstName","lastName"])
        .skip(skip)
        .limit(limit);
  console.log("Feed users",users)
      res.json({ data: users });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
module.exports = router;