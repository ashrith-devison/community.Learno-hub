const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {asyncHandler} = require("../utils/asyncHandler");

router.post('/profile', asyncHandler(async(req, res)=>{
    const {token} = req.body;
    const username = jwt.verify(token,"MasterKey", (err, user) => {
        if(err){
            return res.send({message : err});
        }
        else{
            console.log(user);
            return user.username;
        }
    });
        const User = require('../models/users.profile.model');
        const Profile = require('../models/users.model');
        const userlog = await User.findOne({username : username});
        const profile = await Profile.findOne({username : username});
        if(userlog){

            const data = {
                username : userlog.username,
                Name : userlog.Name,
                Email : userlog.Email,
                Contact : userlog.Contact,
                FatherName : userlog.FatherName,
                FatherContact : userlog.FatherContact,
                MotherName : userlog.MotherName,
                MotherContact : userlog.MotherContact,
                Address : userlog.Address,
                role : profile.role,
                registerid : profile.registerid
            }
            return res.send(data);
        }
        else{
            return res.send('User not found');
        }
}));

router.post('/register', asyncHandler(async(req, res) => {
    const {username,name, email, phoneno, fathername, fcontact, mothername, mcontact, address} = req.body;

        const UserDetails = require('../models/users.profile.model');
        const user = await UserDetails.findOne({username : username});
        if(user){
            return res.send({
                message : 'Username already Exits',
                error : 1,
                icon : 'error'
            });
        }
        else if(!user){
            const newUser = new UserDetails({
                username : username,
                Name : name,
                Email : email,
                FatherName : fathername,
                FatherContact : fcontact,
                MotherName : mothername,
                MotherContact : mcontact,
                Contact : phoneno,
                Address : address
            });
            newUser.save();

            return res.send({
                message : 'User Registered Successfully',
                error : 0,
                icon : 'success'
            });
        }

}));

router.post('/setlogin', asyncHandler(async(req, res) => {
    const {username, password, role, registerid} = req.body;
   
        const User = require('../models/users.model');
        const user = await User.findOne({username: username});
        if(user){
            await User.findOneAndUpdate({username : username},
                 {password : password, role : role, registerid : registerid},
                 {new : true});
            return res.send({
                message : 'Updated Successfully',
                error : 0,
                icon : 'info'
            });
        }
        else if(!user){
            const newUser = new User({
                username : username,
                password : password,
                role : role,
                registerid : registerid
            });
            newUser.save();
            return res.send({
                message : 'User Registered Successfully',
                error : 0,
                icon : 'success'
            });
        }
}));

module.exports = router;