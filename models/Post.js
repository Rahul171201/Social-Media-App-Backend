const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        max: 50
    },
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
},
    {timestamps: true}
);

const Post = new mongoose.model("Post", postSchema);
module.exports = Post;