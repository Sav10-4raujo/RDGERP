const express = require('express'),
    router = express.Router(),
    productController = require('../Controllers/productController'),
    auth = require('../Config/auth');

router.post('/insertProduct', auth.authMid, (req, res) => {
    console.log(req.body)
    productController.insertProduct(req, res);

});

router.get('/getProducts', auth.authMid, (req, res) => {


    productController.getProducts(req, res);

});

router.put('/updateProduct', auth.authMid, (req, res) => {

    productController.updateProduct(req, res);

});

router.delete('/deleteProduct', auth.authMid, (req, res) => {

    productController.deleteProduct(req, res);

});

module.exports = router;