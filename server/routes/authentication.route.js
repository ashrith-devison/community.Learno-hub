const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {asyncHandler} = require('../utils/asyncHandler');

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
                    return res.send(output);
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
                    return res.send(output);
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
                    return res.send(output);
                }
            });
        }
        else{
            return res.send('User not found');
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
            return res.send('User created');
        });
}));

module.exports = router;