var express = require('express');
var router = express.Router();
const adminController = require('../controller/admincontroller');
const adminAuth = require('../middileware/adminAuth')
/* GET home page. */
router.get('/login', adminAuth.isLogin, adminController.loadLogine)

router.post('/login', adminController.login)


router.get('/dashboard', adminAuth.checkSession, adminController.loadDashboard)


router.put('/userse', adminAuth.checkSession, adminController.editUser);




router.delete('/users/:id', adminAuth.checkSession, adminController.deleteuser);

router.post('/use', adminController.addUser);
router.get('/log', adminAuth.checkSession, adminController.logoute);

module.exports = router;
