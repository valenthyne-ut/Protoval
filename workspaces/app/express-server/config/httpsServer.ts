import { cyan } from "chalk";
import { Express } from "express";
import { createServer } from "https";
import { logger } from "../../shared/classes/Logger";
import config from "../../shared/config";

export function setupHTTPSServer(app: Express) {
	createServer(config.SERVER_SSL_CREDENTIALS, app).listen(config.SERVER_PORT)
		.on("listening", () => {
			logger.info("Express server started successfully.");
			logger.info(`Local: ${cyan(`https://localhost:${config.SERVER_PORT}`)}`);
		});
}
