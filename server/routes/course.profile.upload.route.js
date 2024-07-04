const express = require('express');
const router = express.Router();
const {asyncHandler} = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

router.post('/addPage',asyncHandler(async(req, res) => {
    const {CourseCode,Semester,professorname,professorId,title,resourceType} = req.body;
    const curriculum = require('../models/curriculum.model');
    let course = await curriculum.findOne({CourseCode : CourseCode});
    let semIndex = course.offered.findIndex(sem => sem.Semester === Semester);
    let profIndex = course.offered[semIndex].professor.findIndex(prof => prof === professorname);
    if(profIndex < 0){
        throw ApiError.notFound('Professor not found in the curriculum records');
    }
    else{
        const courseProfile = require('../models/course.profile.model');
        let courseAdd = await courseProfile.findOne({coursecode : CourseCode});
        if(courseAdd !== null){
            if(courseAdd.professor.findIndex(prof => prof.professor === professorname) >= 0){
                throw ApiError.badRequest('Professor already exists in the course profile');
            }
            throw ApiError.badRequest('Course Profile already exists');
        } 
        console.log(CourseCode,professorname,professorId, course.CourseName);
        let newProfile = new courseProfile({
            coursecode : CourseCode,
            coursename : course.CourseName,
            Semester : Semester,
            professor : [{
                professor : professorname,
                professorId : professorId,
                material : [{
                    dateofupload : new Date(),
                    date : new Date(),
                    title : title,
                    resources : [{
                        resourceType : resourceType,
                        resourcelink : "https://www.youtube.com/watch?v=9bZkp7q19f0"
                    }]
                }]
            }]
        });
        await newProfile.save();
        return ApiResponse.send(res,200,{},'Course Profile Created');
    }
}));

router.post('/addResource',asyncHandler(async(req, res) => {
    const {CourseCode,professorname,title,resourceType, resourcelink} = req.body;
    const courseProfile = require('../models/course.profile.model');
    let courseAdd = await courseProfile.findOne({coursecode : CourseCode});
    if(courseAdd === null){
        throw ApiError.notFound('Course Profile not found');
    }
    let profIndex = courseAdd.professor.findIndex(prof => prof.professor === professorname);
    if(profIndex < 0){
        throw ApiError.notFound('Professor not found in the course profile');
    }
    let materialIndex = courseAdd.professor[profIndex].material.findIndex(mat => mat.title === title);
    if(materialIndex >= 0){
        courseAdd.professor[profIndex].material[materialIndex].resources.push({
            resourceType : resourceType,
            resourcelink : resourcelink
        });
    }
    else{
        courseAdd.professor[profIndex].material.push({
            dateofupload : new Date(),
            date : new Date(),
            title : title,
            resources : [{
                resourceType : resourceType,
                resourcelink : resourcelink
            }]
        });
    }
    await courseAdd.save();
    return ApiResponse.send(res,200,{},'Resource Added');
}));

router.post('/viewCourse',asyncHandler(async(req, res) => {
    const {CourseCode, professorname} = req.body;
    const courseProfile = require('../models/course.profile.model');
    let courseAdd = await courseProfile.findOne({coursecode : CourseCode});
    if(courseAdd === null){
        throw ApiError.notFound('Course Profile not found');
    }
    else{
        let profIndex = courseAdd.professor.findIndex(prof => prof.professor === professorname);
        if(profIndex < 0){
            throw ApiError.notFound('Professor not found in the course profile');
        }
        course = courseAdd.professor[profIndex];
        course.coursecode = CourseCode;
        course.coursename = courseAdd.coursename;

        return ApiResponse.send(res,200,courseAdd,'Course Profile');
    }
    
}));

module.exports = router;