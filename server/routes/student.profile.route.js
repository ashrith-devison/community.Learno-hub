const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/profile', async(req, res)=>{
    const username = req.body.username;
    try{
        const User = require('../models/users.model');
        const userlog = await User.findOne({username : username});
        if(userlog){
            return res.send(userlog);
        }
        else{
            return res.send('User not found');
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;