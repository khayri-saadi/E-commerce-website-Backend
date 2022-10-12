const mongoose = require('mongoose')
const user = require('./user')

const productSchema = new mongoose.Schema({
    name : {
        type:String,
        required : [true,'every product must have a name'],
        trim : true,

    },
    price : {
        type : Number,
        required : [true,'every product must have a price']
    },
    description : {
        type : String,
        required : [true,'Please enter your product description']
    },
    ratings : {
        type : Number,
        default : 0
    },
    Images : {
                url : {
                    type : String,
                    required:true
                }
            },
        
    categories : {
        type : String,
        required : true,
        enum : {
            values : [
                'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message : 'Please select correct categories for product'
        },
    },
    seller : {
        type:String,
        required : [true,'Please enter the category']
    },
    Stock : {
        type : Number,
        required : [true,'Please enter product Stock'],
        maxLength : 5,
        default : 0
    },
    numOfReview : {
        type:Number,
        default:0
    },
    reviews : [
        {
            name : {
                type : String,
                required : true
            },
            rating : {
                type :Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            },
            user : {
                type : mongoose.Schema.ObjectId,
                ref:user,
                required:true
            }
        }
    ],
    CreatedAt : {
        type : Date,
        default:  Date.now()
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref:user,
        required:true
    }

    


})

const product = mongoose.model('product',productSchema)
module.exports = product