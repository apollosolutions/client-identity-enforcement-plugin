# Apollo Server Plugin for Enforcing Client and Operation Names

**The code in this repository is experimental and has been provided for reference purposes only. Community feedback is welcome but this project may not be supported in the same way that repositories in the official [Apollo GraphQL GitHub organization](https://github.com/apollographql) are. If you need help you can file an issue on this repository, [contact Apollo](https://www.apollographql.com/contact-sales) to talk to an expert, or create a ticket directly in Apollo Studio.**

This project provides a simple working example of a plugin that can be used in Apollo Server to enforce client identity and operation naming. The example uses a basic `ApolloServer` instance, but this can run on any Apollo Server instance, either for subgraphs or the gateway as part of [Apollo Federation](https://www.apollographql.com/docs/federation/).

## Installation

Run the following command to install dependencies then start the gateway and implementing services:

```
npm i && npm start
```

## Usage
See the example code in `plugin.js` for the plugin implementation.

The first check is to make sure the client is passing the proper `clientName` and `clientVersion` headers. The second check validates that the operation name is present in the parsed operation document.

## Known Limitations

This plugin will throw an error in it's current implementation given an invalid operation. If you have existing clients sending operations, you will have to have them update first before you can start enforcing the new rules.