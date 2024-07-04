const asyncHandler = (request) => (req,res,next) => {
    Promise.resolve(request(req,res,next))
    .catch((err) => {
        if(err.statusCode){
            return res.status(err.statusCode).send({
                    error : 1,
                    message : err.message,
                    icon : 'error'
            });
        }
        else{
            return res.status(500).send({
                error : 1,
                message : 'Programmer Error Please check the codeBase' ,
                problem : err.message,
                icon : 'error'
            });
        }
    })
}

module.exports = {
    asyncHandler
}