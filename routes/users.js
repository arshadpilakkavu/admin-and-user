const express = require('express');
const connectDB = require('../db/db');
const userController = require('../controller/usercontroller')
const auth = require('../middileware/auth')

const router = express.Router();

/* GET users listing. */
router.get('/', auth.isLogin, userController.loadLogine)

router.post('/verify', userController.login)

//sing up

router.get('/singup', auth.isLogin, auth.isLogin, userController.loadSingup)

router.post('/sentusr', userController.registerUser)

//home page

router.get('/home', auth.checkSession, userController.loadHome)

// logeout


router.get('/logout', auth.checkSession, userController.logout)

router.get('/brotcamb', (req, res) => {

})






module.exports = router;
