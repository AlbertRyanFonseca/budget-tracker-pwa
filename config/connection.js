const mongoose = require('mongoose');
require('dotenv').config();

function connected() {
    mongoose.connect(process.env.MONGODB_DSN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
}

module.exports = connected;