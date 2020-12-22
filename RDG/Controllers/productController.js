const productModel = require('../Models/productModel'),
    validation = require('../Config/validation');
const {
    update
} = require('../Models/productModel');


module.exports = {

    insertProduct: async (req, res) => {


        let {
            name,
            price,
            stock,
            stockType,
            shelfLife,
            codInput
        } = req.body;

        price = parseFloat(price);
        stock = parseInt(stock);

        const data = {
            name,
            price,
            stock,
            stockType,
            shelfLife,
            codInput
        };

        validation.errors.length = 0

        if (name && price && stock) {

            validation.validationRequired(name, res);
            validation.validationRequired(price, res);
            validation.validationRequired(stock, res);
            validation.validationRequired(shelfLife, res);

            validation.validationLength(name, res, 100, 3, "name");
            validation.validationLength(price, res, 12, 1, "price");
            validation.validationLength(stock, res, 12, 1, "stock");
            

            validation.validationType(name, "string", res, "name");
            validation.validationType(price, "number", res, "price");
            validation.validationType(stock, "number", res, "stock");

            if (validation.errors.length == 0) {

                const result = await productModel.create(data);
                res.json(result);

            }

        } else {

            console.log("sss")

            res.json({
                msg: 'Check that all items have been completed'
            })

        }

    },

    getProducts: async (req, res) => {

        let {
            _id,
            queryCode,
            queryName,
            page
        } = req.query;

        if (_id) {

            query = null;
            const result = await productModel.find({
                _id
            }).catch(() => {

                res.json({
                    msg: "Product not found"
                });
                return

            });

            if (result) {

                if (result.length != 0) {

                    res.json(result);

                } else {

                    res.json({
                        msg: "Product not found"
                    })

                }


            }


        } else if (queryName) {

            const search = new RegExp(`${queryName}[0-9]?`, 'i');
            let amountItems = await productModel.find({
                "name": search
            });
            amountItems = amountItems.length
            const result = await productModel.find({
                    "name": search
                }).sort({
                    'dateInsert': -1
                })
                .skip(page * 10)
                .limit(10).catch(() => {

                    res.json({
                        msg: "There's no products"
                    });
                    return

                });
            res.json({
                result,
                amountItems
            });

        }  else if (queryCode) {

            const search = new RegExp(`${queryCode}[0-9]?`, 'i');
            let amountItems = await productModel.find({
                "productCode": search
            });
            amountItems = amountItems.length
            const result = await productModel.find({
                    "productCode": search
                }).sort({
                    'dateInsert': -1
                })
                .skip(page * 10)
                .limit(10).catch(() => {

                    res.json({
                        msg: "There's no products"
                    });
                    return

                });
            res.json({
                result,
                amountItems
            });

        } else {

            let amountItems = await productModel.find();
            amountItems = amountItems.length;
            const result = await productModel.find()
                .sort({
                    'dateInsert': -1
                })
                .skip(page * 10)
                .limit(10).catch(() => {

                    res.json({
                        msg: "There's no products"
                    });
                    return

                });

            if (result.length != 0) {

                res.json({
                    result,
                    amountItems
                });

            } else {

                res.json({
                    msg: "Product not found"
                })

            }

        }

    },

    updateProduct: async (req, res) => {

        validation.errors.length = 0

        let {
            _id,
            name,
            price,
            stock,
            stockType,
            shelfLife
        } = req.body;

        price = parseFloat(price);
        stock = parseInt(stock);


        validation.validationRequired(_id, res);

        if (name) {

            validation.validationLength(name, res, 100, 3, "name");
            validation.validationType(name, "string", res, "name");

        }

        if (price) {

            validation.validationLength(price, res, 12, 1, "price");
            validation.validationType(price, "number", res, "price");

        }

        if (stock) {

            validation.validationLength(stock, res, 12, 1, "stock");
            validation.validationType(stock, "number", res, "stock");

        }


        let update = {
            name,
            price,
            stock,
            stockType,
            shelfLife
        };

        if (!name) {

            delete update.name

        }

        if (!price) {

            delete update.price

        }

        if (!stock) {

            delete update.stock

        }

        if (!stockType) {

            delete update.stockType

        }

        if (!shelfLife) {

            delete update.shelfLife

        }

        if (validation.errors.length == 0) {

            const result = await productModel.updateOne({
                _id
            }, update).catch((err) => {

                res.json({
                    msg: "Product not found",
                    err
                });
                return

            });
            res.json(result);

        }
    },

    deleteProduct: async (req, res) => {

        const {
            _id
        } = req.body,
            result = await productModel.deleteOne({
                _id
            }).catch(() => {

                res.json({
                    "msg": "Product not found"
                });
                return

            });


        if (result.n == 0) {

            res.json({
                "msg": "Product not found"
            });
            return

        }

        res.json(result);

    }

}