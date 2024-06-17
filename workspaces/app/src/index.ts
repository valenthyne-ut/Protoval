import "dotenv/config";
import express from "express";
import helmet from "helmet";
import useCORS from "./config/CORS";
import config from "./config/Env";
import { Logger } from "./classes/Logger";
import { unrollError } from "./util/Errors";
import { client } from "./client";
import { startHTTPSServer } from "./config/HTTPSServer";
import { cyan } from "chalk";
import { useViewEngine } from "./config/ViewEngine";
import cookieParser from "cookie-parser";
import { apiRouter } from "./api";
import { initModels } from "./database/models";
import { database } from "./database";
import { useSessionMiddleware } from "./config/Session";

const logger = new Logger("Server");

void (async () => {
	try {
		const app = express();

		// Global middleware
		app.use(helmet());
		useCORS(app, config.SERVER_PORT, config.SERVER_NAME, config.ENVIRONMENT);

		// Parser middleware
		app.use(express.json());
		app.use(cookieParser(config.SERVER_COOKIE_SECRET));

		// Session middleware
		useSessionMiddleware(app, database, config.SERVER_COOKIE_SECRET);

		// Database
		initModels(database);
		await database.sync();

		// API middleware
		app.use("/api", apiRouter);

		// View engine
		useViewEngine(app);

		// All done! Now we need to start up the discord 
		// client and start serving when it's ready.
		client.once("ready", () => {
			startHTTPSServer(app, config.SERVER_PORT, config.SERVER_CREDENTIALS)
				.once("listening", () => {
					logger.info("Server started successfully.");
					logger.info(`Local: ${cyan(`https://localhost:${config.SERVER_PORT}`)}`);
					
					if(config.ENVIRONMENT === "production") {
						logger.info(`Public: ${cyan(`https://${config.SERVER_NAME}:${config.SERVER_PORT}`)}`);
					}
				});
		});

		await client.login(config.CLIENT_TOKEN);
	} catch(error) {
		logger.fatal(unrollError(error, true));
	}
})();
