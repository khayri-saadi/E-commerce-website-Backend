const { strict } = require('jade/lib/doctypes')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true,'a user must have a name']
    },
    email : {
        type:String,
        required : [true,' a user must have an email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail,'please enter a valid email']
    },
    password : {
        type : String,
        required : [true,'please enter your password'],
        minlength : [5,"password should have at minimum 5 caractéres"],
        select : false
    },
    avatar :{
        type:String,
        required:true
    }
    ,
    role : {
        type:String,
        enum:['user','admin'],
        default: 'user',
    },
    createdAt : {
        type:Date,
        default : Date.now()
    },
    passwordChangeAt : {
        type:Date,
    },
    ResetpasswordToken:String,
    passwordResetExpires : Date,
})
userSchema.pre('save', async function(next) {
    
        if(!this.isModified('password')) return next()
        this.password = await bcrypt.hash(this.password,12)
        next()
    })
userSchema.methods.correctPassword =  async function(condidatePassword,userpassword) {
        return  await  bcrypt.compare(condidatePassword,userpassword)
    }
    userSchema.pre('save', async function(next) {
        if(!this.isModified('password') || this.isNew) return next()
        this.passwordChangeAt = Date.now() -1000
        next()
    
    })
    userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
        if(this.passwordChangeAt) {
            const changeTimesTamp = parseInt(this.passwordChangeAt.getTime() /1000,10)
            return JWTTimestamp < changeTimesTamp
        }
        // false mean that the user never changed his password
        return false;
    }
    userSchema.methods.SendresetToken = function() {
        // generate random token
        const resetToken = crypto.randomBytes(20).toString('hex')
        // encrypt the reset token and send it via the ResetpasswordToken filed
        this.ResetpasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        // send the date of expiration for this token
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000
        return resetToken;
    }
const user = mongoose.model('user',userSchema)
module.exports = user