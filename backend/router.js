const express = require('express')
const router = express.Router()
const userController = require('./controller/user-controller')
const {verifyUser} = require('./middlewares/passport')
router.post('/user/register',userController.register)
router.post('/user/login',userController.login)
router.get('/user/get',verifyUser,userController.getUserByEmail)
module.exports = router