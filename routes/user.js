const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");


// UPDATE USER
router.put('/:id', async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Updated successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("Updation failed due to unauthorization");
    }
});

// DELETE USER
router.delete('/:id', async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status.json("Deletion completed successfully");
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        console.log("Unauthorized deletion");
    }
});

// GET A USER
router.get('/', async (req, res) => {

    const userId = req.query.userId;
    const username = req.query.username;
    // console.log(userId);

    try {
        const user = userId ? await User.findById(req.query.userId) : await User.findOne({username : username});
        // console.log(user);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }

});

// FOLLOW A USER
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const me = await User.findById(req.body.userId);
            const toFollow = await User.findById(req.params.id);
            if (!me.following.includes(req.params.id)) {
                await me.updateOne({ $push: { following: req.params.id } });
                await toFollow.updateOne({ $push: { followers: req.body.userId } });
                res.status(200).json("Followed Successfully");
            }
            else {
                res.status(403).json("Already Following that user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You cant follow yourself dumb");
    }

});

// UNFOLLOW A USER
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const me = await User.findById(req.body.userId);
            const toUnfollow = await User.findById(req.params.id);
            if (me.following.includes(req.params.id)) {
                await me.updateOne({ $pull: { following: req.params.id } });
                await toUnfollow.updateOne({ $pull: { followers: req.body.userId } });
                res.status(200).json("Unfollowed Successfully");
            }
            else {
                res.status(403).json("Already Not Following that user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You cant unfollow yourself dumb");
    }
});

module.exports = router;