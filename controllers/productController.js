const factory = require('./factory')
const product = require('../models/product')
const catchasync = require('../utils/catchAsync')

exports.getProducts = factory.getall(product)
exports.getOneproduct = factory.getOne(product)
exports.updatProduct = factory.updateOne(product)
exports.deleteProduct = factory.deleteOne(product)

exports.createprod = catchasync(async(req,res,next)=> {
    req.body.user = req.user.id
    const newdoc = await product.create(req.body)
    res.status(201).json({
        status : 'success',
        data : {
            newdoc:newdoc
        }
    })
})

exports.addReview = catchasync(async(req,res,next)=> {

 const {rating, comment , productId} = req.body
    const Review = {
        user : req.user.id,
        name : req.user.name,
        comment,
        rating,
    }
    const Product = await product.findById(productId)
    const isReviewed = Product.reviews.find(
        r => r.user.toString() === req.user.id.toString()
    )
    if(isReviewed) {
        Product.reviews.forEach(review => {
            //console.log(review.user.toString(),'user review')
            //console.log(req.user._id.toString(), 'id current user')
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        Product.reviews.push(Review)
         Product.numOfReview = Product.reviews.length
    }

    Product.ratings = Product.reviews.reduce((acc, item) => item.rating + acc , 0) / Product.reviews.length
    console.log(Product.ratings ,'ratingsss')
    await Product.save({validateBeforeSave : false})
    res.status(200).json({
        status : 'success'
    })  
})
exports.getreviews= catchasync(async(req,res,next)=> {
  const Product = await product.findById(req.query.id)
  res.status(200).json({
      status: 'success',
      reviews : Product.reviews
      
  })
})
exports.deleteReview = catchasync(async(req,res,next)=> {
    const Product = await product.findById(req.query.productId)
    const reviews = Product.reviews.filter( review => {
        review._id.toString() !== req.query.id.toString()
    })
    const numOfReview = reviews.length
    const ratings = Product.reviews.reduce((acc, item) => item.rating + acc , 0) / reviews.length
    await product.findByIdAndUpdate(req.query.productId, {
        ratings,
        numOfReview,
        reviews
    }, {
        new:true,
        runValidators : true,
        useFindAndModify : false
    })
    
    res.status(204).json({
        status:'success'
    })

    
})