const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  # defining an hierarchical data to be used as argument for saveBook
  input BookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # read routes (get)
  type Query {
    # getSingleUser
    me: User
  }

  # write routes (post, put, delete)
  type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(content: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
