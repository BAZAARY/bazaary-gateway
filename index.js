import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildFederatedSchema } from "@apollo/federation";
import http from "http";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000; // Allow configuring the port through an environment variable

// URLs of your Apollo microservices
const service1URL = "https://authentication-bazaary.vercel.app/graphql";
const service2URL = "https://catalogmicroservicegraphql.onrender.com/graphql";

// Configure the Apollo Gateway
const supergraphSdl = new IntrospectAndCompose({
	subgraphs: [
		{ name: "auth", url: service1URL },
		{ name: "catalog", url: service2URL },
	],
});

const gateway = new ApolloGateway({
	supergraphSdl,
	__exposeQueryPlanExperimental: false,
});

const httpServer = http.createServer(app);

const startApolloServer = async (app, httpServer) => {
	const server = new ApolloServer({
		gateway,
		engine: false,
		subscriptions: false,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();

	server.applyMiddleware({ app });
};

startApolloServer(app, httpServer);

app.listen(PORT, () => {
	console.log(`⭐ API GATEWAY Server ready at port ${PORT}`);
});
