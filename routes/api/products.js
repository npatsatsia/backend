const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController')


router.route('/')
    .get(productsController.getProducts)

router.route('/suggestions')
    .get(productsController.handleSuggestProducts)


module.exports = router