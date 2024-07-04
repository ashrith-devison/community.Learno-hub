const asyncHandler = (request) => (req,res,next) => {
    Promise.resolve(request(req,res,next))
    .catch((err) => {
       return res.status(err.statusCode).send({
              error : 1,
              message : err.message,
              icon : 'error'
       });
    })
}

module.exports = {
    asyncHandler
}