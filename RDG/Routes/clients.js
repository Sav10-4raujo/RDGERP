const express = require('express'),
    router = express.Router(),
    clientController = require('../Controllers/userController'),
    auth = require('../Config/auth');

    router.post('/signUp', (req, res) => {

        userController.signUp(req, res);
    
    });

module.exports = router;