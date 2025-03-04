"use client";

import NewsList from "../components/NewsList";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://beta-api.bachlongmobile.com/graphql",
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-100">
        <NewsList />
      </div>
    </ApolloProvider>
  );
}
