const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin : 'http://lms.mayank.ac.in:7308'
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', require('./routes/authentication.route'));
app.use('/student', require('./routes/student.profile.route'));
app.use('/curriculum', require('./routes/student.curriculum.route'));
app.use('/registration', require('./routes/student.registration.route'));


module.exports = app;