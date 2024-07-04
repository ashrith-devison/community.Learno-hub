const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {asyncHandler} = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

router.post('/login', asyncHandler(async(req, res) => {
    const {username, password} = req.body;
        const User = require('../models/users.model');
        
        let log = await User.findOne({username : username});
        if(log){
            await User.findOneAndUpdate({username : username, password : password},
                { $push : {
                    loginTime : {loginTime : new Date(),
                        id : '4321'
                    }  }
                },
                {new : true, useFindAndModify : false}
            ).then((data) => {
                let payload = {
                    username : username,
                    role : data.role,
                    registerid : data.registerid
                };
                let token = jwt.sign(payload, 'MasterKey', {expiresIn : '1h'});
                
                if(data.role === 'admin'){
                    const output = {
                        token : token,
                        message : 'Admin logged in',
                        loginTime : data.loginTime[data.loginTime.length - 1].loginTime,
                        registerid : data.registerid,
                        username : data.username,
                        icon : 'success',
                        redirectLink : '/client/home/home.html'
                    }
                    return ApiResponse.send(res, 200, output, 'Admin logged in');
                }

                else if(data.role === 'professor'){
                    const output = {
                        token : token,
                        message : 'Professor logged in',
                        loginTime : data.loginTime[data.loginTime.length - 1],
                        registerid : data.registerid,
                        username : data.username,
                        icon : 'success',
                        redirectLink : '/professor/content'
                    }
                    return ApiResponse.send(res, 200, output, 'Professor logged in');
                }

                else if(data.role === 'student'){
                    const output = {
                        token : token,
                        message : 'Student logged in',
                        loginTime : data.loginTime[data.loginTime.length - 1],
                        registerid : data.registerid,
                        username : data.username,
                        icon : 'success',
                        redirectLink : '/student/content'
                    }
                    return ApiResponse.send(res, 200, output, 'Student logged in');
                }
            });
        }
        else{
            throw ApiError.unauthorized('User not found');
        }
}));

router.post('/register', asyncHandler(async(req, res)=> {
    const {username, password, role, registerid} = req.body;
        const User = require('../models/users.model');
        const newUser = new User({
            username: username,
            password: password,
            role: role,
            registerid: registerid,
            loginTime: [
                {
                    loginTime: new Date()
                }
            ]
        });
        newUser.save().then(()=>{
            return ApiResponse.send(res, 200, null, 'User registered');
        });
}));

module.exports = router;