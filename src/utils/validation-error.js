const AppError = require('./error-handler');
const { StatusCodes } = require('http-status-codes');

class ValidationError extends AppError {
    constructor(error) { //here error is the error object
        let errorName = error.name;
        let explanation = [];
        error.errors.forEach((err) => { 
            explanation.push(err.message);
        });

        super(
            errorName,
            'Not able to validate the data sent in the request',
            explanation,
            StatusCodes.BAD_REQUEST
        );
    }
}

module.exports = ValidationError;


/* 
every element of the errors array is an object which has message property which gives the error message for 
that particular validation error
*/