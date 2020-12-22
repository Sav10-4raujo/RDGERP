const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const mongoUrl = "mongodb+srv://RDG:UsBQJWGwDW4xIt7e@cluster0-unczd.mongodb.net/test?retryWrites=true&w=majority",
    connect = () => mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {});

module.exports = {
    connect
};