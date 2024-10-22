const mongoose = require('mongoose');
const Book = require('../models/Book');

const mongoURI = process.env.MONGODB_URI;
console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

module.exports = mongoose.connection;


