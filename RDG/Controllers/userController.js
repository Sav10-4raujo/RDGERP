const userModel = require('../Models/userModel'),
    validation = require('../Config/validation'),
    auth = require('../Config/auth');

module.exports = {

    signUp: async (req, res) => {

        let numberUsers = await userModel.find();
        numberUsers = numberUsers.length;

        if(numberUsers >= 5){

            res.json({"msg":"Maximum 5 users allowed"})

        }else{

            validation.errors.length = 0;

            const {
                user,
                name,
                surname,
                password
            } = req.body;
    
            validation.validationRequired(user, res);
            validation.validationRequired(name, res);
            validation.validationRequired(surname, res);
            validation.validationRequired(password, res);
    
            validation.validationLength(user, res, 30, 5, "user");
            validation.validationLength(name, res, 30, 5, "name");
            validation.validationLength(surname, res, 40, 5, "surname");
            validation.validationLength(password, res, 50, 5, "user");
    
            const data = {
                user,
                password,
                name,
                surname
            }
    
            if (validation.errors.length == 0) {
    
                const result = await userModel.create(data).catch((err) => {
    
                    res.json({
                        msg: err
                    });
                    return
    
                });
    
                const {
                    name,
                    user
                } = result,
                token = await auth.sign({
                    user: result._id
                });
    
                res.json({
                    name,
                    user,
                    surname,
                    token
                });
    
            }


        }



    },

    signIn: async (req, res) => {



        if( req.headers.authorization){

        const [, hash] = req.headers.authorization.split(' '),
        [user, password] = Buffer.from(hash, "base64")
        .toString()
        .split(':');


    const result = await userModel.findOne({
        user,
        password
    }).catch((err) => {

        res.json({
            msg: err
        });
        return

    });

    
    if(result){

        const token = await auth.sign({
            user: result._id
        })
        res.json({
            result,
            token
        });

    }else{

        res.json({msg:"Check your login information"});

    }

        }else{

            res.json({msg:"incomplete information"})

        }


    },
    getUsers : async (req, res) =>{

        const {_id} = req.query;

        if(_id){

            const result = await userModel.find({_id}).catch(()=>{

                res.json({msg:"There's no users"})

            });
            res.json(result);

        }else{

            const result = await userModel.find();
            res.json(result);

        }

    },

    deleteUser: async (req, res)=>{

        const {_id} = req.body;

        if(_id){

            const result = await userModel.deleteOne({_id}).catch(()=>{

                res.json({msg:"User not found"});

            });

            if(result.n == 1){

                res.json({msg:"User deleted"});

            }else{

                res.json({msg:"User not found"});

            }

        }

    }

}