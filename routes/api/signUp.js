const express = require('express')
const router = express.Router()
const registerController = require('../../controllers/signUpController')

router.post('/', registerController.registerUser);

module.exports = router;