import cookieParser from "cookie-parser";
import express, { Express } from "express";
import helmet from "helmet";
import { logger } from "../shared/classes/Logger";
import config from "../shared/config";
import { unrollError } from "../shared/utility/Errors";
import { apiRouter } from "./api";
import { setupCORS } from "./config/cors";
import { setupHTTPSServer } from "./config/httpsServer";
import { setupSessionMiddleware } from "./config/session";
import { setupViewEngine } from "./config/viewEngine";
import { database } from "./database";
import { initModels } from "./database/models";

export async function setupServer(): Promise<Express | false> {
	try {
		const app = express();
		
		// Global middleware
		app.use(helmet());
		setupCORS(app);

		// Parser middleware
		app.use(express.json());
		app.use(cookieParser(config.SERVER_COOKIE_SECRET));

		// Session middleware
		setupSessionMiddleware(app, database);

		// Initialize database
		initModels(database);
		await database.sync();

		// API middleware
		app.use("/api", apiRouter);

		// View engine
		setupViewEngine(app);

		setupHTTPSServer(app);

		return app;
	} catch(error) {
		logger.error(unrollError(error, true));
		return false;
	}
}
