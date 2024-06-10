import { Client } from "discord.js";
import { logger } from "../shared/classes/Logger";
import { unrollError } from "../shared/utility/Errors";

/**
 * 
 * @param token 
 * @returns Client
 */
export async function setupClient(token: string): Promise<Client | false> {
	try {
		const client = new Client({ intents: [
			"Guilds"
		]});
	
		client.on("ready", () => {
			logger.info("Client ready.");
		});

		await client.login(token);

		return client;
	} catch(error) {
		logger.fatal(unrollError(error, true));
		return false;
	}
}
