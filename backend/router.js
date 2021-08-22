const express = require('express')
const router = express.Router()
const userController = require('./controller/user-controller')

router.post('/user/register',userController.register)

module.exports = router