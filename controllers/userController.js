const user = require('../models/user')
const  {promisify} = require('util')
const catchasync = require('../utils/catchasync')
const jwt= require('jsonwebtoken')
const AppError = require('../utils/AppError')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET,{
       expiresIn : process.env.JWT_EXPIRES_IN
   })
}
const sendToken = (user,statusCode,res)=> {
    const token = signToken(user._id)
    const cookiesOptions = {
        expires :  
            new Date (Date.now() + process.env.EXPIRES_COOKIE_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly:true
    }
   // console.log(process.env.EXPIRES_COOKIE_IN ,"!!!")
    res.cookie('token',token,cookiesOptions)
    user.password = undefined,
    res.status(statusCode).json({
        status : 'success',
        token,
        user,
    })

}
exports.signup = catchasync(async(req,res,next)=> {
    const newUser = await user.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        avatar : req.body.avatar
    })
    sendToken(newUser,201,res)
})
exports.login = catchasync( async (req,res,next)=> {
    const email = req.body.email
    const  password = req.body.password
    if(!email || !password) {
       return  next(new AppError('invalid email or password',400))
    }
    const User = await user.findOne({email : email}).select('+password')
    //console.log(user._id , "!!!!")
    const comparedpass = await User.correctPassword(password,User.password)
    if(!User || !comparedpass) {
        return next( new AppError('Incorrect email or password',401))
    }
       sendToken(User,200,res);
   })
   exports.protect = catchasync(async(req,res,next)=> {
       const { token } = req.cookies
       if(!token) {
        return next( new AppError('you are not logged in , please log in to get access',401))
        }
    const decoded =  await jwt.verify(token,process.env.JWT_SECRET)
    //console.log(decoded.id ,"!!")
    //console.log(decoded,"!!!!")
    const freshUser = await user.findById(decoded.id)
    //console.log(freshUser,'????')
    if(!freshUser) {
        return next( new AppError('the user belonging to this token does no longer exist',401))
    }
    if(freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please,please log in again',401))
    }
    req.user = freshUser
    next()
     
   })
   exports.logout = catchasync(async(req,res,next)=> {
       res.cookie('token',null, {
           expires : new Date(Date.now()),
           httpOnly:true
       })
       res.status(200).json({
           status : 'success',
           message : 'log out !!'
       })
   })
   exports.restrictTo = (...roles) => {
       return (req,res,next)=> {
        const role = req.user.role
        if(!roles.includes(role)) {
            return next (new AppError(`${req.user.role} can not access this route`))
        }
        next()
       }
      
      
   }
   exports.forgetPassword =  catchasync (async(req,res,next)=> {
    const User = await user.findOne({email : req.body.email})
    //console.log(User)
    if(!User) {
        return next(new AppError(`User doesn't exist with this email`,404))
    }
    const resetToken = User.SendresetToken()
    //console.log(resetToken,"randomtoken")
   const uuss =  await User.save({validateBeforeSave : false})
   //console.log(uuss)

    const resetURL = `${req.protocol}://${req.get('host')}/users/reset-pass/${resetToken}
`
    //console.log(resetURL)
    const message  = `forgot your password ? submit patch request with your new password  to : ${resetURL}\n if you didn't forget this password please 
    ignore this email`
    try {
        await sendEmail({
            email : req.body.email,
            subject : 'your password reset token (valid for 10 minutes)',
            message
        })
        res.status(200).json({
            status : 'success',
            message : 'Token send to email'
        })
       
    } catch(err) {
        User.passwordResetToken = undefined;
        User.passwordResetExpires = undefined;
    await User.save({validateBeforeSave : false})
    return next(new AppError('there was an error sending the email. Try again later !'),500)
   
    }
     

})
exports.resetPassword = catchasync(async(req,res,next)=> {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const User = await user.findOne({ ResetpasswordToken : hashedToken, 
        passwordResetExpires : {$gt: Date.now()}})
        console.log(user)
    if(!User) {
        return next (new AppError('Token invalid or has expired ',400))
    }
    if(req.body.password !== req.body.confirmpassword) {
        return next( new AppError('the passwords does not match'))
    }

    User.password = req.body.password,
    User.ResetpasswordToken = undefined,
    User.passwordResetExpires = undefined
    await User.save()
    sendToken(User,200,res);
});
// get the current logged in user
exports.getMe = catchasync(async(req,res,next)=> {
    const currentuser = await user.findById(req.user.id)
    res.status(200).json({
        status:'success',
        data : {
            currentuser : currentuser
        }
    })
})
exports.updatePassword = catchasync( async(req,res,next) => {
    const User = await user.findById(req.user.id).select('+password')
    console.log(User)
    console.log(User.password)
    if(!await User.correctPassword(req.body.passwordCurrent,User.password)) {
        return next( new AppError('your current password is incorrect',401))
    }
    User.password = req.body.password
    await User.save()
    sendToken(User,200,res)
})
exports.updateMe = catchasync(async(req,res,next)=> {
    const newData  = {
        name : req.body.name,
        email : req.body.email
    }
    const User = await user.findByIdAndUpdate(req.user.id, newData, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    })
    res.status(200).json({
        status:'success',
        data : {
            User : User
        }
    })
})