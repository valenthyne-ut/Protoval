import express, { Express } from "express";
import cors from "cors";
import { unrollError } from "../shared/utility/Errors";
import { logger } from "../shared/classes/Logger";
import config from "../shared/config";
import { setupViewEngine } from "./config/viewEngine";
import { createServer } from "https";
import { cyan } from "chalk";
import helmet from "helmet";

export function setupServer(): Express | false {
	try {
		const app = express();
		
		app.use(cors({
			origin: [`https://localhost:${config.SERVER_PORT}`, `https://localhost:${config.SERVER_PORT}`],
		}));

		app.use(helmet());
		app.use(express.json());
		setupViewEngine(app);

		const httpsServer = createServer(config.SERVER_SSL_CREDENTIALS, app).listen(config.SERVER_PORT);
		httpsServer.on("listening", () => {
			logger.info("Express server started successfully.");
			logger.info(`Local: ${cyan(`https://localhost:${config.SERVER_PORT}`)}`);
		});

		return app;
	} catch(error) {
		logger.error(unrollError(error, true));
		return false;
	}
}
