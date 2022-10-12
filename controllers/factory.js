const AppError = require('../utils/AppError')
const catchasync = require('../utils/catchAsync')
const APIfeatures = require('../utils/ApiFeatures')
const product = require('../models/product')
exports.CreateOne = Model => catchasync(async(req,res,next)=> {
    req.body.user = req.Model.id
    const addDoc = await Model.create(req.body)
    res.status(201).json({
        status : 'success',
        data : {
            addDoc:addDoc
        }
    })
})
exports.updateOne = Model => catchasync(async(req,res,next)=> {
   
    const updateDoc = await Model.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        runValidators:true,
    })
    if(!updateDoc) {
       return next(new AppError('there is no product with this id',404))
    }
    res.status(201).json({
        status:'success',
        data : {
            updateDoc:updateDoc
        }

    })
})
exports.deleteOne = Model => catchasync(async(req,res,next)=> {
    const deleteDoc = await Model.findByIdAndDelete(req.params.id)
    if(!deleteDoc) {
        return next(new AppError('there is no product with this id',404))
    }
    res.status(204).json({
        status:'success',
       
    })
})
exports.getall  = Model => catchasync(async(req,res,next)=> {
    const resPerpage = 2
    const productCount = await product.countDocuments()
    const apifeatures = new APIfeatures(Model.find(),req.query).search().filter().paginate(resPerpage)
    const doc = await apifeatures.query;
    res.status(200).json({
        status:'success',
        results : doc.length,
        productCount,
        data : {
            doc :doc
        }
    })
})
exports.getOne = Model => catchasync(async(req,res,next)=> {
    const doc = await Model.findById(req.params.id)
    if(!doc) {
        return next(new AppError('there is no product with this id',404))
    }
    res.status(200).json({
        status:'success',
        data : {
            doc :doc
        }
    })
})


