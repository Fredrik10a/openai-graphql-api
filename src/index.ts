import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { generateGremlinQuery } from "./services/aiService.js";
import { testConnection } from "./services/gremlinService.js";

const resolvers = {
  Query: {
    test: async (): Promise<unknown> => testConnection(),
    aiGeneratedQuery: async ( _: unknown, { query }: { query: string } ): Promise<unknown> => generateGremlinQuery( query ),
  },
};

const server = new ApolloServer( { typeDefs, resolvers } );

const { url } = await startStandaloneServer( server, { listen: { port: 4000 } } );

console.log( `🚀 GraphQL Server ready at: ${url}` );
