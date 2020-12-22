const saleModel = require('../Models/saleModel'),
    productModel = require('../Models/productModel'),
    validation = require('../Config/validation'),
    moment = require('moment');

module.exports = {

    insertSale: async (req, res) => {


        validation.errors.length = 0;

        let {
            items,
            payment,
            client,
            user
        } = req.body;

        validation.validationRequired(items, res);
        validation.validationRequired(payment, res);

        validation.validationType(items, "object", res, "items");

        if (validation.errors.length == 0) {

            let total = 0;

            items.forEach((item => {

                total += (item.price * item.amount);

            }));

            const data = {
                    items,
                    payment,
                    total,
                    client,
                    user
                },
                result = await saleModel.create(data);

                console.log(result)

            if (result) {

                let transition = 0;

                for (i = 0; i < items.length; i++) {

                    transition = await productModel.find({
                        _id: items[i]._id
                    });

                    transition = transition[0].stock - items[i].amount

                    productModel.findOneAndUpdate({
                            _id: items[i]._id,
                        }, {
                            stock: transition
                        },

                        (data) => {
                            console.log(data)
                        }

                    )

                }

                res.json(result);


            }


        }

    },

    getSales: async (req, res) => {

        validation.errors.length = 0;

        const {
            _id
        } = req.query;
        let {
            initialDate,
            finalDate,
            page,
            payment
        } = req.query;

        if (payment) {

            if (payment == "both") {

                payment = ["card", "money"]

            }

        }

        initialDate = moment(initialDate).startOf('day');
        finalDate = moment(finalDate).endOf('day');


        if (_id) {

            console.log(_id)

            const result = await saleModel.find({
                _id
            }).catch(() => {

                res.json({
                    "msg": "Sale not found"
                })
                return

            });
            if (result) {

                if (result.length == 0) {

                    res.json({
                        "msg": "Sale not found"
                    })

                } else {

                    res.json(result);


                }

            }

        } else {
            if (initialDate && finalDate) {

                console.log('aaa')

                if (new Date(finalDate) >= new Date(initialDate)) {

                    let amountItems = await saleModel.find({
                        date: {
                            $gte: initialDate,
                            $lte: finalDate
                        },
                        payment
                    });
                    amountItems = amountItems.length
                    const result = await saleModel.find({
                            date: {
                                $gte: initialDate,
                                $lte: finalDate
                            },
                            payment
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

                res.json({
                    msg: "It is necessary to specify a period"
                });

            }


        }

    },

    deleteSale: async (req, res) => {


        validation.errors.length = 0

        const {
            _id
        } = req.body;


        validation.validationRequired(_id, res);

        if (validation.errors.length == 0) {

            result = await saleModel.deleteOne({
                _id
            }).catch(() => {

                res.json({
                    msg: "Sale not found"
                });
                return

            });

            if (result.length == 0) {

                res.json({
                    msg: "Sale not found"
                })
                return

            }

            if (result.n == 0) {

                res.json({
                    msg: "Sale not found"
                })

            } else {

                res.send(result);

            }

        }

    },

    downloadSales: async (req, res) => {

        let {
            initialDate,
            finalDate,
            payment
        } = req.query;

        if (payment) {

            if (payment == "both") {

                payment = ["card", "money"]

            }

        }

        if (initialDate && finalDate) {

            if (new Date(finalDate) >= new Date(initialDate)) {

                const result = await saleModel.find({
                    date: {
                        $gte: initialDate,
                        $lte: finalDate
                    },
                    payment
                }, ["date", "total", "payment"], {
                    lean: true
                })


                console.log(result)

                result.forEach((e) => {

                    e._id = e._id.toString()


                })


                if (typeof XLSX == 'undefined') {

                    XLSX = require('xlsx');

                }

                const ws = XLSX.utils.json_to_sheet(result),
                    wb = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(wb, ws, "Vendas");
                XLSX.writeFile(wb, "Vendas.xlsx");
                res.download('./Vendas.xlsx')

            } else {
                res.json({
                    msg: "Specify a valid period"
                })
            }
        }

    },
    getTotalValue: async (req, res) => {

        let {
            initialDate,
            finalDate,
            payment
        } = req.query;

        if (payment) {

            if (payment == "both") {

                payment = ["card", "money"]

            }

        }


        initialDate = moment(initialDate).startOf('day');
        finalDate = moment(finalDate).endOf('day');

        if (initialDate && finalDate) {

            if (new Date(finalDate) >= new Date(initialDate)) {

                let amountItems = await saleModel.find({
                    date: {
                        $gte: initialDate,
                        $lte: finalDate
                    },
                    payment
                });

                let totalSum = 0;

                const result = await saleModel.find({
                    date: {
                        $gte: initialDate,
                        $lte: finalDate
                    },
                    payment
                });

                for (i = 0; i < result.length; i++) {

                    totalSum += result[i].total;

                }

                if (result.length == 0) {

                    res.json({
                        msg: "There are no sales in the period"
                    })

                } else {

                    res.json({
                        totalSum
                    });

                }


            } else {
                res.json({
                    msg: "Specify a valid period"
                })
            }

        } else {

            res.json({
                msg: "It is necessary to specify a period"
            });

        }

    }

}