require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./routes');

const { ApolloServer } = require('@apollo/server');
const { authMiddleware } = require('./utils/auth');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startApolloServer = async () => {
  await server.start();
  console.log("Apollo Server started");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Log when MongoDB is connected successfully
  mongoose.connection.once('open', () => {
    console.log('Successfully connected to MongoDB!');

    app.listen(PORT, HOST, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call to start Apollo Server
startApolloServer();
