const factory = require('./factory')
const user = require('../models/user')

exports.getAllusers = factory.getall(user)
exports.updateUser = factory.updateOne(user)
exports.deletuser = factory.deleteOne(user)
exports.getOneuser = factory.getOne(user)