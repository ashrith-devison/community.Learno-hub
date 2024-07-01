const express = require('express');
const router = express.Router();

router.post('/query', async(req, res)=>{
    const {category} = req.body;
    const courses = require('../models/curriculum.model');
    const curriculum = await courses.find({category : category});
    res.send(curriculum);
});

router.post('/add/course', async(req, res)=>{
    const course = require('../models/curriculum.model');

    const courseExists = await course.findOne({CourseCode : req.body.CourseCode});
    if(courseExists){
        return res.send("Course Already Exists");
    }
    const newCourse = new course({
        category : req.body.category,
        CourseCode : req.body.CourseCode,
        CourseName : req.body.CourseName,
        CreditHours : req.body.CreditHours,
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
});

module.exports = router;