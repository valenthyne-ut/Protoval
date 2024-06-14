import cors from "cors";
import { Express } from "express";
import config from "../../shared/config";

export function setupCORS(app: Express) {
	app.use(cors({
		origin: [
			`https://localhost:${config.SERVER_PORT}`,
			`https://127.0.0.1:${config.SERVER_PORT}`
		]
	}));
}
