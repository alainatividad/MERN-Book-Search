const { AuthenticationError } = require("apollo-server-express");
const { Book, User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, arg, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    saveBook: async (parent, { args }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: args.body } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    removeBook: async (parent, { book }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: book.bookId } } },
        { new: true }
      );
      return updatedUser;
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials entered");
      }

      const correctPw = await User.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials entered");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
