class ApiError extends Error {
    constructor(statusCode, message = "something went wrong",
        errors = [],
        statch = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;
        this.data = null;

        if (statch) {
            this.stack = statch;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;