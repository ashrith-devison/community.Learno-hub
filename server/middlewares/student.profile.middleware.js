const jwt = require('jsonwebtoken');
const {asyncHandler} = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const checkToken = asyncHandler(async (req, res, next) => {
    const {token} = req.body;
    if(!token){
        throw new ApiError.unauthorized("Invalid Token");
    }
    jwt.verify(token, 'MasterKey', (err, data) => {
        if(err){
            throw ApiError.unauthorized("Invalid Token || Token Expired");
        }
        else if(data){
            req.body.username = data.username;
            next();
        }
    });

});

module.exports = checkToken;