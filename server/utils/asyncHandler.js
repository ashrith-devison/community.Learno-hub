const asyncHandler = (request) => (req,res,next) => {
    Promise.resolve(request(req,res,next))
    .catch((err) => {
       return res.send({
            message : err.message,
            status : 500
        });
    })
}

module.exports = {
    asyncHandler
}