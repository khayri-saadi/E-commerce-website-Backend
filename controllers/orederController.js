const Order = require('../models/order')
const factory = require('./factory')
const catchasync = require('../utils/catchasync')
const AppError = require('../utils/AppError')
const product = require('../models/product')
exports.createOrder = catchasync(async(req,res,next)=> {
    console.log(req.user.id)
    req.body.ShippingInfo.user  = req.user.id
    const addDoc = await Order.create(req.body)
    console.log(req.user.id)
    res.status(201).json({
        status : 'success',
        data : {
            addDoc:addDoc
        }
    })
})
exports.getoneOrder = factory.getOne(Order)
exports.getMyorder = catchasync(async(req,res,next)=> {
    console.log(req.user.id)
    const myorders = await Order.find({'ShippingInfo.user':req.user.id})
    res.status(201).json({
        status : 'success',
        data : {
            myorders : myorders
        }
    })
})
exports.getallOrders = catchasync(async(req,res,next)=> {
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.paymentInfo.totalPrice
        console.log(order.paymentInfo.totalPrice)
    })
    res.status(200).json({
        status:'success',
        totalAmount,
        orders
    })
    

})
exports.updateOrder = catchasync(async(req,res,next)=> {
    const order = await Order.findById(req.params.id)
    if(order.paymentInfo.orderStatus === 'Delivred') {
        return next (new AppError('You have already delivred this order'))
    }
    order.orderItems.forEach(async item => {
        await updateStock(item.Product,item.quantity)
    })
    order.paymentInfo.orderStatus = req.body.status
    order.paymentInfo.deliverAt = Date.now()
    await order.save()
    res.status(200).json({
        status:'success'

    })
})

const updateStock = async(id, quantity)  => {
    const Product = await product.findById(id)
    Product.Stock = Product.Stock - quantity
    Product.save({validateBeforeSave : false})
}
exports.deleteOrder = factory.deleteOne(Order)