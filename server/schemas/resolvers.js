const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return context.user;
            }
            throw new AuthenticationError('You need to be logged in to view this information.');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email');
            }

            const isMatch = await user.isCorrectPassword(password);
            if (!isMatch) {
                throw new AuthenticationError('Wrong password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, data, context) => {
            console.log (data)
            if (context.user) {
                // Create book object
                // const book = { authors, description, title, bookId, image, link };

                // Add book to savedBooks
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: data.book } },
                    { new: true, runValidators: true }
                ).select('-__v -password');

                return updatedUser;
            }
            throw new AuthenticationError('Not authenticated');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).select('-__v -password');

                return updatedUser;
            }
            throw new AuthenticationError('Not authenticated');
        },
    },
};

module.exports = resolvers;
