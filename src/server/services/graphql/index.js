import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { importSchema } from 'graphql-import';
import Resolvers from './resolvers';

const executableSchema = makeExecutableSchema({
  typeDefs: `
    ${importSchema(path.join(__dirname, 'schema.graphql'))}

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `,
  resolvers: Resolvers,
});

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => req,
});

export default server;
