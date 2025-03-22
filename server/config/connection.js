const mongoose = require('mongoose');
require('dotenv').config(); 

// Get MongoDB URI from environment variables
const mongoUri = process.env.MONGODB_URI; 
console.log('MongoDB URI:', mongoUri);

// Connect to MongoDB
mongoose.connect(mongoUri, {
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Log when the connection is successfully opened
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is open and ready for use.');
});

// Export mongoose connection to be used elsewhere in the project
module.exports = mongoose.connection;
