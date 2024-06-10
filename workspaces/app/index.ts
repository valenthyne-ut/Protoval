import "dotenv/config";
import { setupClient } from "./client";
import { Client } from "discord.js";

void (async () => {
	const token = process.env.CLIENT_TOKEN;
	if(!token) { throw new Error("Client token was not supplied."); }

	const successful = (await setupClient(token)) instanceof Client;
	if(!successful) { process.exit(1); }
})();
