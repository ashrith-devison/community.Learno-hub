const mongoose = require('mongoose');

const LoginHistory = new mongoose.Schema({
    loginTime : {
        type: Date,
        required: true,
    }
}, { _id : false });

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum : ['admin', 'student','professor'],
    },
    registerid : { 
        type: String,
        required: true,
        unique: true,
    },
    loginTime : [LoginHistory]
});

module.exports = mongoose.model('User-Base', UserSchema);