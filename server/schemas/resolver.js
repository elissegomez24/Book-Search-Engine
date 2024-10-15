const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findById(context.user._id).populate('savedBooks');
            }
            throw new Error('Not authenticated');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new Error("Incorrect password");
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new Error('Not authenticated');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new Error('Not authenticated');
        },
    },
};

module.exports = resolvers;
