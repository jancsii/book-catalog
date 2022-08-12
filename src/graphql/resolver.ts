import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    getBooks: async () => {
      const response = await prisma.book.findMany();

      return response;
    },
    getBookById: async (_parent, args) => {
      const response = await prisma.book.findUnique({
        where: {
          id: args.id
        }
      });

      if (!response) throw new Error('There is no book with that id.');

      return response;
    },
    getAuthors: async () => {
      const response = await prisma.author.findMany();

      return response;
    },
    getAuthorById: async (_parent, args) => {
      const response = await prisma.author.findUnique({
        where: {
          id: args.id
        }
      });

      if (!response) throw new Error('There is no author with that id.');

      return response;
    },
    getAuthorByIdWithBooks: async (_parent, args) => {
      const response = await prisma.author.findUnique({
        where: {
          id: args.id
        },
        include: { books: true }
      });

      if (!response) throw new Error('There is no author with that id.');

      return response;
    },
    getBooksGroupedByAuthors: async () => {
      const response = await prisma.author.findMany({
        include: { books: true }
      });

      return response;
    }
  },
  Mutation: {
    createBook: async (_parent, args) => {
      const { title, description, ISBN, published, authorId } = args;
      if (!title || !description || !ISBN || typeof published !== 'boolean')
        throw new Error('Please provide valid credentials');

      const book = await prisma.book.findMany({
        where: {
          OR: [
            {
              title: {
                equals: title
              }
            },
            {
              ISBN: {
                equals: ISBN
              }
            }
          ]
        }
      });

      if (book.length !== 0) throw new Error('The title or ISBN is already taken.');

      const author = await prisma.author.findUnique({
        where: {
          id: authorId
        }
      });

      if (!author) throw new Error('There is no author with that id.');

      const response = await prisma.book.create({
        data: {
          title,
          description,
          ISBN,
          published,
          author: {
            connect: { id: authorId }
          }
        }
      });

      return response;
    },
    deleteBook: async (_parent, args) => {
      try {
        const response = await prisma.book.delete({
          where: {
            id: args.id
          }
        });

        return response;
      } catch (err) {
        throw new Error('Does not exist book with that id');
      }
    },
    updateBook: async (_parent, args) => {
      const { id, title, description, ISBN, published } = args;

      const book = await prisma.book.findUnique({
        where: { id }
      });

      if (!book) throw new Error('There is no book with that id.');

      const books = await prisma.book.findMany({
        where: {
          OR: [
            {
              title: {
                equals: title
              }
            },
            {
              ISBN: {
                equals: ISBN
              }
            }
          ]
        }
      });

      if (books.length !== 0) throw new Error('The title or ISBN is already taken.');

      try {
        const response = await prisma.book.update({
          where: { id: id },
          data: {
            title: title || book.title,
            description: description || book.description,
            ISBN: ISBN || book.ISBN,
            published: published || book.published
          }
        });

        return response;
      } catch (err) {
        throw new Error('Update failed...');
      }
    },
    createAuthor: async (_parent, args) => {
      const { name, email, books } = args;

      if (!name || !email || !isEmailValid(email)) throw new Error('Please provide valid credentials');

      const author = await prisma.author.findMany({
        where: { email }
      });

      if (author.length !== 0) throw new Error('This email is already taken.');

      try {
        const response = await prisma.author.create({
          data: {
            name,
            email,
            books: {
              create: books
            }
          }
        });

        return response;
      } catch (err) {
        throw new Error('Please provide valid credentials for book data. Title and ISBN must be unique.');
      }
    },
    updateAuthor: async (_parent, args) => {
      const { id, name, email } = args;

      const author = await prisma.author.findUnique({
        where: { id }
      });

      if (!author) throw new Error('There is no author with that id.');

      if (email) {
        const authors = await prisma.author.findMany({
          where: { email }
        });

        if (authors.length !== 0) throw new Error('This email is already taken.');

        if (!isEmailValid(email)) throw new Error('Not a valid email.');
      }

      try {
        const response = await prisma.author.update({
          where: { id },
          data: { name: name || author.name, email: email || author.email }
        });

        return response;
      } catch (err) {
        throw new Error('Update failed...');
      }
    },
    deleteAuthor: async (_parent, args) => {
      const { id } = args;

      try {
        await prisma.book.deleteMany({
          where: { authorId: id }
        });

        const response = await prisma.author.delete({
          where: { id }
        });

        return response;
      } catch (err) {
        throw new Error('Does not exist author with that id');
      }
    }
  },
  Book: {
    author: (parent) => {
      return prisma.book
        .findUnique({
          where: { id: parent?.id }
        })
        .author();
    }
  },
  Author: {
    books: (parent) => {
      return prisma.author
        .findUnique({
          where: { id: parent?.id }
        })
        .books();
    }
  }
};

const isEmailValid = (email: string): boolean => {
  return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
};
