const AppError = require('../utils/AppError')

const devError = (err,res)=> {
    res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
        stack : err.stack,
        Error : err

    });
}
const handlecastErrorDB = error => {
    const message = `Invalid ${error.path} : ${error.value}`
    console.log(error.value)
    console.log(error.path)
    return new AppError(message,400)

}
const handleduplicateErrors = err => {
    const message = `Duplicate field value, please enter another name`;
    return new AppError(message,400)
}
const SendValidation = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid Input data . ${errors.join('. ')}`
    return new AppError(message,400)
}
const handleReferenceEroor = err => {
    return new AppError(`undefined variable `,404)
}
const handletokenError = err => new AppError('Invalid token please log in again  ',401)
const  handleExpiredError = err => new AppError('Time Token expired,Please log in again  ',401)

const prodError = (err,res)=> {
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status : err.status,
            message : err.message
        });
    } else {
        console.error('error:',err)
        res.status(500).json({
            status:'error',
            message : 'something went wrong'
        })
    }
}
module.exports = (err,req,res,next)=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    if(process.env.NODE_ENV ==='DEVELOPMENT') {
        devError(err,res)
    } else if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }
        if(err.name ==='CastError') error =  handlecastErrorDB(error)
        if(err.code === 11000) error = handleduplicateErrors(error)
        if(err.name ==='ValidationError') error = SendValidation(error)
        if(err.name === 'JsonWebTokenError') error = handletokenError(error)
        if(err.name ==='TokenExpiredError') error = handleExpiredError(error)
        if(err.name ==='RefernceError') error = handleReferenceEroor(error)
        prodError(err,res)

    
    }
    
}