const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productsController')


router.route('/')
    .get(productsController.getProducts)

router.route('/suggestions')
    .get(productsController.handleSuggestProducts)

router.route('/updatekey')
    .post(productsController.updateCurrentColorKey)
router.route('/addproducts')
    .post(productsController.postProducts)

router.route('/edit/:_id')
    .post(productsController.editProduct)


module.exports = router