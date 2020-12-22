const mongoose = require('mongoose'),
    crypto = require('crypto'),
    schema = new mongoose.Schema({

        user: {
            type: String,
            required: true,
            unique: true,

        },

        password: {

            type: String,
            required: true,
            select: false,
            set: value =>
                crypto
                .createHash('md5')
                .update(value)
                .digest('hex')

        },

        name: {

            type: String,
            required: true,

        },

        surname: {

            type: String,
            required: true,

        },

    });

const User = mongoose.model('User', schema);

module.exports = User;