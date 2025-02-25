/**
 * Formats success responses
 * @param {object} data - The data to return in the response
 * @param {string} message - Optional message to include
 */
const successResponse = (data, message = "Operation successful") => {
    return {
        status: "success",
        message,
        data,
    };
};

/**
 * Formats error responses
 * @param {string} message - The error message to return
 * @param {Array} errors - The list of detailed error messages
 * @param {number} statusCode - The HTTP status code for the error
 */
const errorResponse = (message, errors = [], statusCode = 400) => {
    const response = {
        status: "error",
        message,
        statusCode,
    };

    if (errors.length > 0) {
        response.errors = errors;
    }
    return response;
};

export {
    successResponse,
    errorResponse
};