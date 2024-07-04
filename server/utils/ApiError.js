class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;
    }

    static badRequest(message) {
        return new ApiError(400, message || 'Bad Request');
    }

    static unauthorized(message) {
        return new ApiError(401, message || 'Unauthorized');
    }

    static forbidden(message) {
        return new ApiError(403, message || 'Forbidden');
    }

    static notFound(message) {
        return new ApiError(404, message || 'Not Found');
    }
}


module.exports = ApiError;