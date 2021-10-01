var mongoose = require("mongoose");
var db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
    useNewUrlParser: true,
    useFindAndModify: false,
});

var transactionSeed = [
    {
        name: "Christmas",
        value: 300,
    },
    {
        name: "Medical",
        value: 3000,
    },
    {
        name: "birthday-party",
        value: 100,
    },
    {
        name: "gaming-chair",
        value: 250,
    },
];

db.Transaction.deleteMany({})
    .then(() => db.Transaction.collection.insertMany(transactionSeed))
    .then((data) => {
        console.log(data.result.n + " records inserted!");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });