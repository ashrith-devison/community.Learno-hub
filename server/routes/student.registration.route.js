const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const middleware = require('../middlewares/student.registration.middleware');
const {asyncHandler} = require('../utils/asyncHandler');

router.post('/data', asyncHandler(async(req, res)=>{
    const {registerid} = req.body;
    const StudentRegistration = require('../models/student.registration.model');
    const student = await StudentRegistration.findOne({registerNo : registerid});
    res.send(student);
}));

router.post('/add', asyncHandler(async(req, res)=>{
    const StudentRegistration = require('../models/student.registration.model');
    const {username, semester } = req.body;
    if(!username || !semester){
        return res.send('Please enter all fields');
    }
    console.log(username);
    const student = await StudentRegistration.findOne({username : username});
    if(student){
        return res.send('Student already exists');
    }
    const newStudent = new StudentRegistration({
        username : username,
        courses : [{
            coursecode : "INC1001",
            coursename : "Program Orientation",
            credithours : 0,
            semester : semester}
        ],
        creditsCompleted : 0,
        creditsRegistered : 0
    });
    await newStudent.save().then(()=>{
        console.log('Student registered');
    });
    res.send('Student registered');
}));

router.post('/addcourse', asyncHandler(async(req, res)=>{
    const StudentRegistration = require('../models/student.registration.model');
    const curriculum = require('../models/curriculum.model');
    const {username, CourseCode, CourseName, CreditHours, semester} = req.body;
    const student = await StudentRegistration.findOne({username : username});
    const courseExist = await curriculum.findOne({CourseCode: CourseCode});
    if(student && courseExist){
        const courseExist = student.courses.findIndex(course => course.coursecode === CourseCode);
        if(courseExist !== -1){
            return res.send({
                error : 1,
                course : 'Course already registered in ' + student.courses[courseExist].semester + ' semester',
                icon : 'error'
            });
        }
        else{
            student.courses.push({
                coursecode : CourseCode,
                coursename : CourseName,
                credithours : CreditHours,
                semester : semester,
            });
            student.creditsRegistered += CreditHours;   
            await student.save().then(()=>{
                console.log('Course added');
            });
            res.send('Course added');
        }   
    }
    else{
        res.send({
            error : 1,
            message : 'Course not found in your curriculum',
            icon : 'error'
        });
    }
}));

router.post('/viewcourses', middleware, asyncHandler(async(req, res)=>{
    const StudentRegistration = require('../models/student.registration.model');
    const {username, semester} = req.body;
    const student = await StudentRegistration.findOne({username : username});
    if(student){
        const courses = student.courses.filter(course => course.semester === semester);
        if(courses.length > 0){
            res.send(courses);
        }
       else{
            res.send({
                    error : 1,
                    message : 'No courses found in '+ semester + ' semester',
                    icon : 'error',
                    semester : semester
                });
       }
    }
    else{
        res.send({
            error : 1,
            message : 'Student not found',
            icon : 'error'
        });
    }
}));

module.exports = router;