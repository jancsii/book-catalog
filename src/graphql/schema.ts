import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    description: String!
    ISBN: String!
    published: Boolean!
    author: Author!
  }

  type Author {
    id: ID!
    name: String!
    email: String!
    books: [Book]
  }

  type Query {
    getBooks: [Book]
    getBookById(id: ID!): Book!

    getAuthors: [Author]
    getAuthorById(id: ID!): Author!

    getAuthorByIdWithBooks(id: ID!): Author!
    getBooksGroupedByAuthors: [Author]
  }

  type Mutation {
    createBook(authorId: ID!, title: String!, description: String!, ISBN: String!, published: Boolean!): Book!
    updateBook(id: ID!, title: String, description: String, ISBN: String, published: Boolean): Book!
    deleteBook(id: ID!): Book!

    createAuthor(name: String!, email: String!, books: [CreateBooksWithAuthor!]): Author!
    updateAuthor(id: ID!, name: String, email: String): Author!
    deleteAuthor(id: ID!): Author!
  }

  input CreateBooksWithAuthor {
    title: String!
    description: String!
    ISBN: String!
    published: Boolean!
  }
`;
