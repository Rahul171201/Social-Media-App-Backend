const express = require('express');
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.get('/register', (req, res) => {
    res.send("ok register page");
});
router.post('/register', async (req, res) => {
    try {
        // generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        // create new user
        const newuser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });
        // save new user and respond
        const user = await newuser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

// LOGIN
router.post('/login',async (req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(404).json("user not found");
        }
        else{
            const validPass = bcrypt.compare(req.body.password, user.password);
            if(validPass){
                res.status(200).json("Valid Email and Password");
            }
            else{
                res.status(400).json("Invalid Password");
            }
        }
    } catch(err){
        response.status(500).json(err);
        console.log(err);
    }
});

module.exports = router;