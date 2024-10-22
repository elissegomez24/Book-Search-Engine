const mongoose = require('mongoose');

// Function to clean the database by dropping a specified collection
module.exports = async (modelName, collectionName) => {
    try {
        // Check if the model and collection exist
        const modelExists = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();

        if (modelExists.length) {
            console.log(`Dropping existing collection: ${collectionName}`);
            await mongoose.connection.dropCollection(collectionName); // Drop the collection if it exists
        } else {
            console.log(`Collection ${collectionName} does not exist. No need to drop.`);
        }
    } catch (err) {
        console.error(`Error dropping collection ${collectionName}: `, err);
        throw err; 
    }
};

