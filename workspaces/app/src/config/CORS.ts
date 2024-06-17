import cors from "cors";
import { Express } from "express";
import { Environment } from "../types/Environment";

export default function useCORS(app: Express, port: number, serverName: string, environment: Environment) {
	const environmentConfigs = {
		"development": [
			`https://localhost:${port}`,
			`https://127.0.0.1:${port}`
		],
		"production": `https://${serverName}:${port}`
	};

	app.use(cors({
		origin: environmentConfigs[environment]
	}));
}
