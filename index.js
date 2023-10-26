import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 4000; // Allow configuring the port through an environment variable

// URLs of your Apollo microservices
const authenticationURL = "https://authentication-bazaary.vercel.app/graphql";
const catalogURL = "https://catalogmicroservicegraphql.onrender.com/graphql";

// Configure the Apollo Gateway
const supergraphSdl = new IntrospectAndCompose({
	subgraphs: [
		{ name: "authentication", url: authenticationURL },
		{ name: "catalog", url: catalogURL },
	],
});

const gateway = new ApolloGateway({
	supergraphSdl,
	__exposeQueryPlanExperimental: false,
});

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
