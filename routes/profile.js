const express = require("express");
const router = express.Router();
const {userAuth} = require('../middlewares/auth')

router.get("/profile/view",userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user);

    } catch(err){
        res.status(500).send("No profiles are present")
    }
})

router.patch('/profile/edit',user)
module.exports = router;