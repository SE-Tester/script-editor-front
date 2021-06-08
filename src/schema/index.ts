import { endpoints } from 'config';
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const graphqlStore = new ApolloClient({
  uri: endpoints.v2.graphql,
  cache: new InMemoryCache(),
});
