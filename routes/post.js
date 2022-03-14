const router = require('express').Router();
const { crossOriginResourcePolicy } = require('helmet');
const Post = require('../models/Post');

// CREATE POST
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        await newPost.save();
        res.status(200).json("Successfully created the post");
    } catch (err) {
        console.log(err);
    }
});

// UPDATE POST
router.put('/:id', async (req, res) => {
    const currentPost = await Post.findById(req.params.id);
    if (currentPost.userId === req.body.userId) {
        try {
            await currentPost.updateOne({ $set: req.body });
            res.status(200).json("Post succefully updated");
        } catch (err) {
            console.log(err);
        }
    }
    else {
        res.send("Unauthorized updation to post");
    }
});

// DELETE POST
router.delete('/:id', async (req, res) => {
    const currentPost = await Post.findById(req.params.id);
    if (currentPost.userId === req.body.userId) {
        try {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json("Successsfully Deleted the Post");
        } catch (err) {
            console.log(err);
        }
    }
    else {
        console.log("You cannot delete someone else's post");
    }
});

// LIKE AND UNLIKE A POST
router.put('/:id/like', async (req, res) => {
    const currentPost = await Post.findById(req.params.id);
    if (!currentPost.likes.includes(req.body.userId)) {
        try {
            await currentPost.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Successfully liked the post");
        } catch (err) {
            console.log(err);
        }
    }
    else {
        try {
            await currentPost.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Successfully unliked the post");
        } catch (err) {
            console.log(err);
        }
    }
});

// GET A POST
router.get('/:id', async (req, res) => {
    try {
        const currentPost = await Post.findById(req.params.id);
        res.status(200).json(currentPost);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;