const express = require('express'),
    router = express.Router(),
    inputController = require('../Controllers/inputController'),
    auth = require('../Config/auth');

    router.post('/insertInput', auth.authMid, (req, res) => {
        
        inputController.insertInput(req, res);
    
    });
    
    router.get('/getInputs', auth.authMid, (req, res) => {
    
        inputController.getInputs(req, res);
    
    });
    
    router.put('/updateInput', auth.authMid, (req, res) => {
    
        inputController.updateInput(req, res);
    
    });
    
    router.delete('/deleteInput', auth.authMid, (req, res) => {
    
        inputController.deleteInput(req, res);
    
    });

module.exports = router;