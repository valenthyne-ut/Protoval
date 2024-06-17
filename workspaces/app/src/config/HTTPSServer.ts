import { Express } from "express";
import { Server, ServerOptions, createServer } from "https";

export function startHTTPSServer(app: Express, port: number, options: ServerOptions): Server {
	return createServer(options, app).listen(port);
}
