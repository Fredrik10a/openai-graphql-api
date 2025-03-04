import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Node {
    id: ID!
    name: String!
    type: String!
  }

  type Query {
    test: [Node]
    aiGeneratedQuery(query: String!): [Node]
  }
`;
