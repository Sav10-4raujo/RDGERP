const inputModel = require('../Models/inputModel'),
    productModel = require('../Models/productModel'),
    validation = require('../Config/validation'),
    moment = require("moment");


module.exports = {

    insertInput: async (req, res) => {


        let {
            name,
            price,
            stock,
            stockType,
            shelfLife,
            provider,
            noteValue,
            productCode,
            user
        } = req.body;

        price = parseFloat(price);
        stock = parseFloat(stock);
        noteValue = parseFloat(noteValue);

        const data = {
            name,
            price,
            stock,
            stockType,
            shelfLife,
            provider,
            noteValue,
            productCode,
            user
        };

        console.log(data)

        validation.errors.length = 0

        if (name && price && stock) {

            validation.validationRequired(name, res);
            validation.validationRequired(price, res);
            validation.validationRequired(stock, res);
            validation.validationRequired(stockType, res);
            validation.validationRequired(provider, res);
            validation.validationRequired(noteValue, res);
            validation.validationRequired(productCode, res);

            validation.validationLength(name, res, 100, 3, "name");
            validation.validationLength(price, res, 12, 1, "price");
            validation.validationLength(stock, res, 12, 1, "stock");
            validation.validationLength(stockType, res, 100, 2, "stockType");
            validation.validationLength(provider, res, 100, 3, "provider");
            validation.validationLength(noteValue, res, 12, 1, "noteValue");
            validation.validationLength(productCode, res, 4, 4, "productCode");
            

            validation.validationType(name, "string", res, "name");
            validation.validationType(price, "number", res, "price");
            validation.validationType(stock, "number", res, "stock");
            validation.validationType(stockType, "string", res, "stockType");
            validation.validationType(provider, "string", res, "provider");
            validation.validationType(stock, "number", res, "stock");
            validation.validationType(stock, "number", res, "stock");
            

            if (validation.errors.length == 0) {



                const result = await inputModel.create(data);
                const productData = {

                    name,
                    price,
                    stock,
                    stockType,
                    shelfLife,
                    productCode

                };

                const verify = await productModel.findOne({productCode});
            

                if(verify){

                    const newStock = verify.stock + stock;
                    console.log(newStock)

                    const update = {
                        name,
                        price,
                        stock: newStock,
                        stockType,
                        shelfLife
                        }

                    const newValues = await productModel.updateOne({_id: verify._id}, update);

                }else{

                    const product = await productModel.create(productData);

                }


                res.json(result);

            }

        } else {


            res.json({
                msg: 'Check that all items have been completed'
            })

        }

    },

    getInputs: async (req, res) => {

        console.log(req.query)

        let {
            _id,
            query,
            page,
            initialDate,
            finalDate
        } = req.query;

        initialDate = moment(initialDate).startOf('day');
        finalDate = moment(finalDate).endOf('day');

        if (_id) {

            query = null;
            const result = await inputModel.find({
                _id
            }).catch(() => {

                res.json({
                    msg: "Input not found"
                });
                return

            });

            if (result) {

                if (result.length != 0) {

                    res.json(result);

                } else {

                    res.json({
                        msg: "Input not found"
                    })

                }


            }

        } else if (query) {

            const search = new RegExp(`${query}[0-9]?`, 'i');
            let amountItems = await inputModel.find({
                "name": search
            });
            amountItems = amountItems.length
            const result = await inputModel.find({
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

        } else if (initialDate && finalDate) {

            if (new Date(finalDate) >= new Date(initialDate)) {

                let amountItems = await inputModel.find({
                    dateInsert: {
                        $gte: initialDate,
                        $lte: finalDate
                    }
                });
                amountItems = amountItems.length
                const result = await inputModel.find({
                    dateInsert: {
                            $gte: initialDate,
                            $lte: finalDate
                        }
                    })
                    .skip(page * 10)
                    .limit(10).catch(() => {

                        res.json({
                            msg: "There's no products"
                        });
                        return

                    });

                if (result.length == 0) {

                    res.json({
                        msg: "There are no sales in the period"
                    })

                }

                res.json({
                    result,
                    amountItems
                });

            } else {
                res.json({
                    msg: "Specify a valid period"
                })
            }

        } else {

            let amountItems = await inputModel.find();
            amountItems = amountItems.length;
            const result = await inputModel.find()
                .sort({
                    'dateInsert': -1
                })
                .skip(page * 10)
                .limit(10).catch(() => {

                    res.json({
                        msg: "There's no inputs"
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
                    msg: "Input not found"
                })

            }

        }

    },

    updateInput: async (req, res) => {

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

            const result = await inputModel.updateOne({
                _id
            }, update).catch((err) => {

                res.json({
                    msg: "Input not found",
                    err
                });
                return

            });
            res.json(result);

        }
    },

    deleteInput: async (req, res) => {

        const {
            _id
        } = req.body,
            result = await inputModel.deleteOne({
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