const mongoose = require('mongoose');
const Book = require('../models/Book');
const cleanDB = require('./cleanDB');
const bookData = require('./bookData.json');

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/googlebooks', {
})
    .then(() => {
        console.log('MongoDB connected!');
        // Clean the database before seeding
        return cleanDB('Book', 'books');
    })
    .then(() => {
        // Define the seed data
        const seedBooks = [
            {
                title: 'Star Wars',
                authors: ['Author Name'],
                description: 'A book about Star Wars',
                image: 'image-url',
                link: 'link-to-book',
                bookId: '1',
            },
            {
                title: 'The Lord of the Rings',
                authors: ['J.R.R. Tolkien'],
                description: 'A high-fantasy novel about the journey to destroy the One Ring.',
                image: 'image-url',
                link: 'link-to-book',
                bookId: '2',
            },
            // Spread the bookData array if it has valid entries
            ...bookData.map(book => ({
                ...book,
                // Ensure bookId is defined
                bookId: book.bookId || generateUniqueId()
            })),
        ];

        // Log seedBooks to verify all data
        console.log('Books to be seeded:', seedBooks);

    })
    .then(() => {
        console.log('Books seeded!');
    })
    .catch((err) => {
        console.error('Error during seeding:', err);
    })
    .finally(() => {
        // Close the connection
        mongoose.connection.close();
    });

// Function to generate a unique ID if needed
function generateUniqueId() {
    return `${Date.now()}-${Math.random()}`;
}
