import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolver';

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
