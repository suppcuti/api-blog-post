import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://beta-api.bachlongmobile.com/graphql",
      headers: {
        "Content-Type": "application/json",
      },
      fetchOptions: { cache: "no-store" },
    }),
    cache: new InMemoryCache(),
    ssrMode: true, // Quan trọng: Hỗ trợ SSR
  });
}
