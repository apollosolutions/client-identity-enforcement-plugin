const { ApolloServer } = require("apollo-server");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const plugin = require("./plugin");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [plugin],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Apollo Server ready at ${url}`);
});