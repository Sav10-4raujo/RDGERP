const express = require('express'),
    router = express.Router(),
    saleController = require('../Controllers/saleController'),
    auth = require('../Config/auth');

router.post('/insertSale', auth.authMid,(req, res) => {

    saleController.insertSale(req, res);

});


router.get('/downloadSales', auth.authMid, (req, res) => {

    saleController.downloadSales(req, res);


});

router.get('/getTotalValue', auth.authMid, (req, res) => {

    saleController.getTotalValue(req, res);


});


router.get('/getSales', auth.authMid, (req, res) => {

    saleController.getSales(req, res);

});

router.delete('/deleteSale', auth.authMid, (req, res) => {

    saleController.deleteSale(req, res);

});

module.exports = router;

//auth.authMid,