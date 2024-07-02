const mongoose = require('mongoose');

const coursesRegistered = new mongoose.Schema({
    coursecode  : {
        type : String,
        required : true
    },
    coursename : {
        type : String,
        required : true
    },
    credithours : {
        type : Number,
        required : true
    },
    semester : {
        type : String,
        required : true
    },
    Grade : {
        type : String,
    }
}, {_id : false});
const registrationSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    courses : [coursesRegistered],
    creditsCompleted : {
        type : Number,
        required : true
    },
    creditsRegistered : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model('Courses-Registered', registrationSchema);