const mongoose = require('mongoose');
const Book = require('../models/Book');

// Use the environment variable for MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

mongoose.connect(mongoURI, {
})
    .then(() => {
        console.log('MongoDB connected!');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

module.exports = mongoose.connection;
