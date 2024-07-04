const express = require('express');
const router = express.Router();
const {asyncHandler} = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
router.post('/query', asyncHandler(async(req, res)=>{
    const {category} = req.body;
    const courses = require('../models/curriculum.model');
    const curriculum = await courses.find({category : category});
    res.send(curriculum);
}));

router.post('/add/course', asyncHandler(async(req, res)=>{
    const course = require('../models/curriculum.model');
    const {category, CourseCode, CourseName, CreditHours} = req.body;
    const courseExists = await course.findOne({CourseCode : CourseCode});
    if(courseExists){
        throw ApiError.badRequest('Course already exists');
    }
    const newCourse = new course({
        category : category,
        CourseCode : CourseCode,
        CourseName : CourseName,
        CreditHours : CreditHours,
        offered : [{
            Semester : "INIT",
            Year :  0,
            professor : ["INIT"]
        }]
    });
    await newCourse.save().then(()=>{
        console.log("Course Added");
    });
    res.send("Course Added");
}));

module.exports = router;