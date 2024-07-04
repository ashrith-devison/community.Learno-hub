const express = require('express');
const router = express.Router();
const {asyncHandler} = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

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
    res.send(new ApiResponse(200, {} , 'Course Added'));
}));

router.post('/add/professor', asyncHandler(async(req, res)=>{
    const professors = require('../models/users.model');
    const users = require('../models/users.profile.model');
    const {professorname,CourseCode,Semester} = req.body;
    const user = await users.findOne({username : professorname});
    if(user){
        const professor = await professors.findOne({username : user.username});
        const output = {
            username : professor.username,
            name : user.Name,
            email : user.Email,
            phone : user.Contact,
            address : user.Address,
            role : professor.role
        };
        if(output.role === 'professor'){
            const course = require('../models/curriculum.model');
            const courseExists = await course.findOne({CourseCode : CourseCode});
            const semester = courseExists.offered.findIndex(sem => sem.Semester === Semester);
            if(courseExists.offered[semester].professor[semester].includes(output.username)){
                throw ApiError.badRequest('Professor already assigned');
            }
            else{
                courseExists.offered[semester].professor.push(`${output.username}`)
                await courseExists.save().then(()=>{
                        return ApiResponse.send(res, 200, courseExists.offered[semester].professor, 'Professor Assigned');
                    });
                }
        }
        throw ApiError.notFound('User is not a Professor')
        
    }
    throw ApiError.notFound('User not found');
}));


router.post('/add/semester', asyncHandler(async(req,res) => {
    const {CourseCode, Semester} = req.body;
    const curriculum = require('../models/curriculum.model');
    let course = await curriculum.findOne({CourseCode : CourseCode});
    let courseIndex = course.offered.findIndex(sem => sem.Semester === Semester);
    if(courseIndex >= 0){
        throw ApiError.badRequest('Semester already Exist');
    }
    else{
        course.offered.push({
            Semester : Semester,
            professor : ["INIT"]
        });
        await course.save().then(()=>{
            console.log('Semester Added');
        });
        return ApiResponse.send(res,200, course.offered, 'Semester Added');
    }
}));

module.exports = router;