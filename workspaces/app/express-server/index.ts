import { cyan } from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { createServer } from "https";
import { logger } from "../shared/classes/Logger";
import config from "../shared/config";
import { unrollError } from "../shared/utility/Errors";
import { apiRouter } from "./api";
import { setupViewEngine } from "./config/viewEngine";
import { prepareDatabase } from "./database";

export async function setupServer(): Promise<Express | false> {
	try {
		await prepareDatabase();
		const app = express();
		
		app.use(cors({
			origin: [`https://localhost:${config.SERVER_PORT}`, `https://localhost:${config.SERVER_PORT}`],
		}));

		app.use(helmet());
		app.use(express.json());
		app.use(cookieParser());
		app.use("/api", apiRouter);

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
