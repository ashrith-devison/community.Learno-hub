const mongoose = require('mongoose');

const offeredLog = new mongoose.Schema({
    Semester : {
        type : String,
        required : true
    },
    Year : {
        type : Number,
        required : true
    },
    professor : [ {
        type : String,
        required : true
    }],
}, {_id : false});
const curriculumSchema = new mongoose.Schema({
    category : {
        type : String,
        required : true,
        enum : ["UE", "PE", "UC", "PC"]
    },
    CourseCode : {
        type : String,
        required : true,
        unique : true
    },
    CourseName : {
        type : String,
        required : true
    },
    CreditHours : {
        type : Number,
        required : true
    },
    offered : [offeredLog]
});

module.exports = mongoose.model("Curriculum", curriculumSchema);