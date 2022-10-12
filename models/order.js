const mongoose = require('mongoose')
const user = require('./user')
const orderSchema = mongoose.Schema({
    ShippingInfo : {
        address : {
            type:String,
            required:true

        },
        PhoneNumber : {
            type:Number,
            required:true

        },
        city : {
            type:String,
            required:true

        },
        Country : {
            type:String,
            required:true

        },
        postalCode : {
            type:Number,
            required:true
        },
        user : {
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:'user'
        },
    },
        orderItems : [
            {
            name : {
                type:String,
                required:true
            },
            quantity : {
                type:Number,
                required:true
            },
            Image:{
                type:String,
                required:true
            },
            price : {
                type:Number,
                required:true
            },
            Product : {
                type:mongoose.Schema.ObjectId,
                required:true,
                ref:'product'
            },
        }
        ],
        paymentInfo : {
            id : {
                type:String
            },
            status : {
                type:String
            },
            paidAt : {
                type:Date
            },
            itemsPrice : {
                type:Number,
                required:true,
                default: 0.0
            },
            taxPrice : {
                type:Number,
                required:true,
                default: 0.0
            },
            ShippingPrice : {
                type:Number,
                required:true,
                default: 0.0
            },
            totalPrice : {
                type:Number,
                required:true,
                default :0.0
            },
            orderStatus : {
                type:String,
                required:true,
                default : 'Processing',
            },
            deliverAt : {
                type:Date,
            },
            createdAt : {
                type:Date,
                default:Date.now()
            }
        }
    }
)
orderSchema.pre(/^find/,function(next) {
    this.populate({
        path : 'ShippingInfo.user',
        select: 'name photo '
    })
    next()
})

const Order = mongoose.model('Order',orderSchema)
module.exports = Order