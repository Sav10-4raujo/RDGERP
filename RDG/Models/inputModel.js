const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    name: {

        type: String,
        required: true

    },

    price: {

        type: Number,
        required: true

    },

    stock: {

        type: Number,
        required: true

    },
    stockType: {

        type: String,
        required: true

    },

    dateInsert: {

        type: Date,
        default: new Date() - 10800000,
        required: true

    },
    shelfLife: {

        type: Date,
        required: true

    },
    provider:{

        type: String,
        required: true

    },
    noteValue:{

        type: Number,
        required: true

    },
    productCode:{

        type: String,
        required: true

    },
    user:{
        
        type: String,
        required: true

    }

});

const Input = mongoose.model('Input', schema);

module.exports = Input;