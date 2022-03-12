const { ApolloError } = require('apollo-server');

module.exports = {
    requestDidStart: async (requestContext) => {
        // These headers are standard for any Apollo client
        // https://www.apollographql.com/docs/studio/metrics/client-awareness/#using-apollo-server-and-apollo-client
        const clientName = requestContext.request.http.headers.get('apollographql-client-name');
        const clientVersion = requestContext.request.http.headers.get('apollographql-client-version');

        if (!clientName) {
            const logString = `Execution Denied: Operation has no identified client`;
            console.debug(logString);

            throw new ApolloError(logString);
        }

        if (!clientVersion) {
            const logString = `Execution Denied: Client ${clientName} has no identified version`;
            console.debug(logString);

            throw new ApolloError(logString);
        }

        return {
            async parsingDidStart({ queryHash, request }) {
                if (!request.operationName) {
                    console.debug(`Unnamed Operation: ${queryHash}`);

                    const error = new ApolloError('Execution denied: Unnamed operation');

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
        };
    },
};