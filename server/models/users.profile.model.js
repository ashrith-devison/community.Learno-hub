const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    Name : {
        type : String,
        required : true
    },
    Contact : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true
    },
    FatherName : {
        type : String,
        required : true
    },
    FatherContact : {
        type : String,
        required : true
    },
    MotherName : {
        type : String,
        required : true
    },
    MotherContact : {
        required : true,
        type : String,
    },
    Address : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("User-Profiles", UserSchema);