const express = require("express");
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require("../models/connectionRequest");

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status.toLowerCase();

        const validStatuses = ["ignored", "interested"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Status should be "interested" or "ignored"' });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({ message: "Connection already exists" });
        }

        const connection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connection.save();

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requestId = req.params.requestId;
        const status = req.params.status.toLowerCase();

        const validStatuses = ["accepted", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Status should be accepted, rejected' });
        }

        const fromUser = await User.findById(requestId);
        if (!fromUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const connectionRequest = await ConnectionRequest.findOne({
           fromUserId:requestId,
           toUserId:loggedInUser._id,
           status:"interested"
        });

        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection doesnot exists" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
