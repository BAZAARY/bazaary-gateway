import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { buildFederatedSchema } from '@apollo/federation';
import http from 'http';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 9000; // Allow configuring the port through an environment variable

// URLs of your Apollo microservices
const service1URL = 'https://authentication-bazaary.vercel.app/graphql';
const service2URL = 'https://catalogmicroservicegraphql.onrender.com/graphql';

// Configure the Apollo Gateway
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'service1', url: service1URL },
    { name: 'service2', url: service2URL },
  ],
});

const httpServer = http.createServer(app);

const startApolloServer = async (app, httpServer) => {
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
