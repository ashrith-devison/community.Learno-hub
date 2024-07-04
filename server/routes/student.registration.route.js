const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/student.registration.middleware');
const {asyncHandler} = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

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
        throw new ApiError.badRequest('Please fill all the fields');
    }
    console.log(username);
    const student = await StudentRegistration.findOne({username : username});
    if(student){
        throw new ApiError.badRequest('Student already registered');
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
            throw ApiError.badRequest('Course already added');
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
        throw ApiError.notFound('Course not found in your curriculum');
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
            throw ApiError.notFound('No courses found in '+ semester + ' semester');
       }
    }
    else{
        throw ApiError.notFound('Student not found, Please Check your username');
    }
}));

router.post('/courseHistory', asyncHandler(async (req, res) => {
    const StudentRegistration = require('../models/student.registration.model');
    const {username} = req.body;
    const student = await StudentRegistration.findOne({username : username});
    if(student){
        res.send({
            courses : student.courses,
            creditsCompleted : student.creditsCompleted,
            creditsRegistered : student.creditsRegistered
        });
    }
    else{
        throw ApiError.notFound('Student not found, Please Check your username');
    }
}));

module.exports = router;