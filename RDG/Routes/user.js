const express = require('express'),
    router = express.Router(),
    userController = require('../Controllers/userController'),
    auth = require('../Config/auth');

router.post('/signUp', auth.authMid, (req, res) => {

    userController.signUp(req, res);

});

router.get('/signIn', (req, res) => {

    userController.signIn(req, res);

});

router.get('/getUsers', auth.authMid,  (req, res) => {

    userController.getUsers(req, res);

});

router.delete('/deleteUser', auth.authMid, (req, res) => {

    userController.deleteUser(req, res);

});



module.exports = router;