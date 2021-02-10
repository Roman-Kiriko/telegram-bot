const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')

router.get('/user/:id', controller.getUser)
router.post('/user', controller.saveUser)
router.put('/user', controller.updateUser)
module.exports = router