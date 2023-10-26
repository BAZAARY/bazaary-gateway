const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloGateway } = require('@apollo/gateway');
const { buildFederatedSchema } = require('@apollo/federation');

const app = express();
const PORT = 3000;

// URLs de tus microservicios Apollo
const service1URL = "https://authentication-bazaary.vercel.app/graphql";
const service2URL = "https://catalogmicroservicegraphql.onrender.com/graphql";

// Configura el servidor Apollo Gateway
const gateway = new ApolloGateway({
	serviceList: [
	  { name: 'service1', url: service1URL },
	  { name: 'service2', url: service2URL },
	],
  });
  
  async function startApolloServer() {
	const server = new ApolloServer({
	  gateway,
	  subscriptions: false,
	});
  
	await server.start();
  
	server.applyMiddleware({ app });
  }
  
  startApolloServer().then(() => {
	app.listen(PORT, () => {
	  console.log(`Server is running on port ${PORT}`);
	});
  });