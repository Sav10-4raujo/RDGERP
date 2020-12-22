const jwt = require('jsonwebtoken'),
    secret = "d04bf847b59cda121d5897a661030592",
    userModel = require('../Models/userModel');

module.exports = {

    sign: payload => jwt.sign(payload, secret, {
        expiresIn: 86400
    }),
    authMid: async (req, res, next) => {
        if (req.headers.authorization) {

            const [, token] = req.headers.authorization.split(' ')

            try {

                const payload = await jwt.verify(token, secret),
                    result = await userModel.findById(payload.user).catch((err) => {

                        res.json(err);

                    });

                if (!result) {

                    res.json({
                        msg: "not authorized"
                    })
                    return

                }

                next()

            } catch (error) {

                res.json(error);

            }

        } else {

            res.json({
                msg: "not authorized"
            })
            return

        }
    }

}