const mongoose = require('mongoose'),
    schema = new mongoose.Schema({

        items: {

            type: Array,
            required: true

        },

        total: {

            type: Number,
            required: true

        },

        payment:{

            type: String, 
            required: true

        },

        date: {

            type: Date,
            default: new Date(),
            required: true

        },
        client: {

            type: String,
            required: true

        },
        user:{

            type: String, 
            required: true

        }

    });

const Sale = mongoose.model('Sale', schema);

module.exports = Sale;