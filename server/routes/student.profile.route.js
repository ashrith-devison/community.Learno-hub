const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {asyncHandler} = require("../utils/asyncHandler");
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const middleware = require('../middlewares/student.profile.middleware');

router.post('/profile', middleware, asyncHandler(async(req, res)=>{
        const {username} = req.body;
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
            return ApiResponse.send(res, 200, data, 'User Profile');
        }
        else{
            throw ApiError.badRequest('User not found');
        }
}));

router.post('/register', asyncHandler(async(req, res) => {
    const {username,name, email, phoneno, fathername, fcontact, mothername, mcontact, address} = req.body;

        const UserDetails = require('../models/users.profile.model');
        const user = await UserDetails.findOne({username : username});
        if(user){
            throw ApiError.badRequest('User already registered');
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

            const output = {
                message : 'User Registered Successfully',
                error : 0,
                icon : 'success'
            };

            return ApiResponse.send(res, 200, output, 'User registered');
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
            const output = {
                message : 'Updated Successfully',
                error : 0,
                icon : 'info'
            };
            return ApiResponse.send(res, 200, output, 'User updated');
        }
        else if(!user){
            const newUser = new User({
                username : username,
                password : password,
                role : role,
                registerid : registerid
            });
            newUser.save();
            output = {
                message : 'User Registered Successfully',
                error : 0,
                icon : 'success'
            };
            return ApiResponse.send(res, 200, output, 'User registered');
        }
}));

module.exports = router;