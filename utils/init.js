const dotenv = require('dotenv')
dotenv.config({path : './config.env'})
const product = require('../models/product')
const mongoose = require('mongoose')
const fs = require('fs')

const options = {
    useNewUrlParser : true,
    useUnifiedTopology: true 
  }
 const DB = 'mongodb://localhost/shop'
  mongoose.connect(DB,options).then(()=> {
    console.log('db connected successfully')
  })
  const products = fs.readFileSync(`../data/product.json`,'utf-8')
  console.log(products)

  const importdata = async() => {
    try {
        await product.create(products)
        console.log('data loaded succesfully')
    } catch(err) {
        console.log(err)

    }
}
const deleteData = async()=> {
    try {
        await product.deleteMany()
    } catch(err) {
        console.log(err)
    }
}
importdata()
