var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController')
const userController = require('../controllers/userController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.end('hello in express');
});
router.route('/products').post(userController.protect,productController.createprod).get(productController.getProducts)
router.route('/products/:id')
.get(productController.getOneproduct)
.patch(userController.protect,productController.updatProduct)
.delete(userController.protect,userController.restrictTo('admin'),productController.deleteProduct)
router.route('/product/addreview').put(userController.protect,productController.addReview)
router.route('/product/reviews').get(userController.protect,userController.restrictTo('user admin'),productController.getreviews)
router.route('/product/reviews').delete(userController.protect,userController.restrictTo('user admin'),productController.deleteReview)


module.exports = router;
