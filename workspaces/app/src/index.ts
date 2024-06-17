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

const logger = new Logger("Server");

void (async () => {
	try {
		const app = express();

		// Global middleware
		app.use(helmet());
		useCORS(app, config.SERVER_PORT);

		// View engine
		useViewEngine(app);

		// All done! Now we need to start up the discord 
		// client and start serving when it's ready.
		await client.login(config.CLIENT_TOKEN);
		client.once("ready", () => {
			startHTTPSServer(app, config.SERVER_PORT, config.SERVER_CREDENTIALS)
				.once("listening", () => {
					logger.info("Server started successfully.");
					logger.info(`Local: ${cyan(`https://localhost:${config.SERVER_PORT}`)}`);
				});
		});
	} catch(error) {
		logger.fatal(unrollError(error, true));
	}
})();
