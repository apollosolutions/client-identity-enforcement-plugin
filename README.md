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

## Rationale
It is a GraphQL best practice to ensure that every trace operaiton has a named/versioned client identification with it. Apollo Client and Server both use `apollographql-client-name` and `apollographql-client-version` by default to do this. The client identity headers are pulled in on `requestDidStart`:

```js
requestDidStart: async (requestContext) => {
    const clientName = requestContext.request.http.headers.get('apollographql-client-name');
    const clientVersion = requestContext.request.http.headers.get('apollographql-client-version');
    ...
```

The plugin is a simple example of how to throw an error for any GraphQL operations that don't have `apollographql-client-name` and `apollographql-client-version` defined.

```js
if (!clientName) {
    throw new ApolloError('Execution Denied: Operation has no identified client');
}

if (!clientVersion) {
    throw new ApolloError(`Execution Denied: Client ${clientName} has no identified version`);
}
```

It is also a GraphQL best practice to ensure every operation has a provided name for your graph. For example, you only want queries like this to execute:

```graphql
query YouUnderstandWhatImDoing {
    me {
        profile {
            name
        }
    }
}
```

and reject any queries that didn't have an operation name defined:

```graphql
query {
    me {
        profile {
            name
        }
    }
}
```

This demo also ensures that the operation name is provided or throw an error in `parsingDidStart` where the `operationName` will be populated at this point in the request lifecycle. It also gives an example of adding additional information on to the `extensions` portion of the GraphQL errors:

```js
async parsingDidStart({ queryHash, request }) {
    if (!request.operationName) {
        let error = new ApolloError('Execution denied: Unnamed operation');

        Object.assign(error.extensions, {
            queryHash: queryHash,
            clientName: clientName,
            clientVersion: clientVersion,
            exception: {
                message: `All operations must be named`,
            },
        });

        throw error;
    }
},
```

## Known Limitations

* This plugin will throw an error given an invalid operation. If you have existing clients sending operations, you will have to have them update first before you can start enforcing the new rules.

* Older versions of `@apollo/gateway` did not forward the operation name to the subgraphs. You should double check before adding this plugin to your subgraph service that is is receiving the operation name.