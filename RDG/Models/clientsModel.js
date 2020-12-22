const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    name: {

        type: String,
        required: true

    },
    surname: {

      type: String,
      required: true

    },
    cpf: {

        type: String,
        required: true

    },
    birthday: {

        type: Date,
        required: true

    },
    phone: {

      type: String,

    },
    dateInsert: {

        type: Date,
        default: new Date() - 10800000,
        required: true

    }

});

const Clients = mongoose.model('Clients', schema);

module.exports = Clients;