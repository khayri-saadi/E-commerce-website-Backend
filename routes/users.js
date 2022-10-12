var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const Usercontroller = require('../controllers/userController')
const adminController = require('../controllers/adminCont')

/* GET users listing. */


router.route('/signup').post(Usercontroller.signup)
router.route('/login').post(Usercontroller.login)
router.use(Usercontroller.protect)

router.route('/')
.get(Usercontroller.restrictTo('admin'),adminController.getAllusers)
router.route('/:id')
.patch(Usercontroller.restrictTo('admin'),adminController.updateUser)
.delete(Usercontroller.restrictTo('admin'),adminController.deletuser)
.get(Usercontroller.restrictTo('admin'),adminController.getOneuser)


router.route('/logout')
.get(Usercontroller.logout)
router.route('/forgot-pass').post(Usercontroller.forgetPassword)
router.route('/reset-pass/:token').put(Usercontroller.resetPassword)
router.route('/profile').get(Usercontroller.getMe)
router.route('/update-password').put(Usercontroller.updatePassword)
router.route('/updateMe').patch(Usercontroller.updateMe)






module.exports = router;
