import "dotenv/config";
import { setupClient } from "./client";
import { Client } from "discord.js";
import config from "./shared/config";

void (async () => {
	const token = config.CLIENT_TOKEN;

	const client = await setupClient({ intents: config.CLIENT_INTENTS }, token);
	if(!(client instanceof Client)) { process.exit(1); }
})();
