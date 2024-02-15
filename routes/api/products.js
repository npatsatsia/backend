const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController')


router.route('/')
    .post(productsController.postProducts)
    .get(productsController.getProducts)


module.exports = router