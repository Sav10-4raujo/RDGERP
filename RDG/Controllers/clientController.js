const clientsModel = require('../Models/clientsModel'),
    validation = require('../Config/validation'),
    auth = require('../Config/auth');


module.exports = {

  insertClient : async(req, res)=>{


    const {name, surname, cpf, birthday} = req.body;

    if(req.body.phone){

      const {phone} = req.body;

      const data = {

        name,
        surname,
        cpf,
        birthday,
        phone
  
      }

      const result = await clientsModel.create(data);

    }else{

      const data = {

        name,
        surname,
        cpf,
        birthday
  
      }

      const result = await clientsModel.create(data);

    }

    res.json(result);

  },

  getClients: async (req, res) => {

    let {
        _id,
        queryCode,
        queryName,
        page
    } = req.query;

    if (_id) {

        query = null;
        const result = await clientsModel.find({
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
        let amountItems = await clientsModel.find({
            "name": search
        });
        amountItems = amountItems.length
        const result = await clientsModel.find({
                "name": search
            }).sort({
                'dateInsert': -1
            })
            .skip(page * 10)
            .limit(10).catch(() => {

                res.json({
                    msg: "There's no clients"
                });
                return

            });
        res.json({
            result,
            amountItems
        });

    }  else if (queryCode) {

        const search = new RegExp(`${queryCode}[0-9]?`, 'i');
        let amountItems = await clientsModel.find({
            "cpf": search
        });
        amountItems = amountItems.length
        const result = await clientsModel.find({
                "cpf": search
            }).sort({
                'dateInsert': -1
            })
            .skip(page * 10)
            .limit(10).catch(() => {

                res.json({
                    msg: "There's no clients"
                });
                return

            });
        res.json({
            result,
            amountItems
        });

    } else {

        let amountItems = await clientsModel.find();
        amountItems = amountItems.length;
        const result = await clientsModel.find()
            .sort({
                'dateInsert': -1
            })
            .skip(page * 10)
            .limit(10).catch(() => {

                res.json({
                    msg: "There's no clients"
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
                msg: "Client not found"
            })

        }

    }

}

}