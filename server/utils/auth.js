const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = function ({ req }) {
  // Allows token to be sent via headers
  let token = req.headers.authorization || '';

  // Split the token from "Bearer <tokenvalue>"
  if (token.startsWith('Bearer ')) {
    token = token.split(' ').pop().trim();
  }

  // Initialize user as null
  let user = null;

  // If there is a token, verify it
  if (token) {
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      user = data; // If token is valid, set user to the data from token
    } catch (err) {
      console.log('Invalid token:', err);
      user = null; // Set user to null if token verification fails
    }
  }

  // Return the user object as part of the context
  return { user };
};

const signToken = function ({ username, email, _id }) {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = { authMiddleware, signToken };
