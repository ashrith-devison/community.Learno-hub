class ApiResponse{
    constructor(statusCode, data, message='Success'){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }

    static send(res, statusCode, data, message){
        return res.status(statusCode).send(new ApiResponse(statusCode, data, message));
    }
}

module.exports = ApiResponse;