const mongoose = require('mongoose');
const { Schema } = mongoose;

// This is a schema for books, which can be used as a standalone model or as a subdocument
const bookSchema = new Schema({
  // saved book id from GoogleBooks
  bookId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book, bookSchema };
