const mongoose = require('mongoose');

const resource = new mongoose.Schema({
    resourceType : {
        type : String,
        required : true,
        enum : ['hyperlink','pdf','image']
    },
    resourcelink : {
        type : String,
        required : true
    }
},{_id : false});
const CourseWork = new mongoose.Schema({
    dateofupload : {
        type : Date,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    resources : [resource]
},{_id : false});
const CourseProfile = new mongoose.Schema({
    professor : {
        type : String,
        required : true
    },
    professorId : {
        type : String,
        required : true
    },
    material : [CourseWork]
},{_id : false});
const CourseProfileSchema = new mongoose.Schema({
    coursecode : {
        type: String,
        required : true
    },
    coursename : {
        type : String,
        required : true
    },
    professor : [CourseProfile]
});

module.exports = new mongoose.model("Course-Page",CourseProfileSchema);