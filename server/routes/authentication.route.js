const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', async(req, res) => {
    const {username, password} = req.body;
    try{
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
    }
    catch(err){
        console.log(err);
    }
});

router.post('/register', async(req, res)=> {
    const {username, password, role, registerid} = req.body;
    try{
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
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;