const mongoose = require('mongoose');

async function connectDB(){
    await mongoose.connect("mongodb://127.0.0.1:27017/project-ba")
    .then(()=>{
        console.log("Connected to DataBase");
        return 1;
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports =  connectDB;