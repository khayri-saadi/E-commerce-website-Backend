var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const Ordercontroller = require('../controllers/orederController')

router.use(userController.protect)
router.route('/addOrder').post(Ordercontroller.createOrder)
router.route('/addOrder/:id').get(Ordercontroller.getoneOrder)
router.route('/myorder').get(Ordercontroller.getMyorder)
router.route('/getallOrderders').get(Ordercontroller.getallOrders)
router.route('/updateOrder/:id').put(Ordercontroller.updateOrder)
router.route('/:id').delete(Ordercontroller.deleteOrder)
module.exports = router;