import cors from "cors";
import { Express } from "express";

export default function useCORS(app: Express, port: number) {
	app.use(cors({
		origin: [
			`https://localhost:${port}`,
			`https://127.0.0.1:${port}`
		]
	}));
}
