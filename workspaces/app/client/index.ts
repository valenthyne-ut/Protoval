import { Client, ClientOptions } from "discord.js";
import { logger } from "../shared/classes/Logger";
import { unrollError } from "../shared/utility/Errors";

export async function setupClient(config: ClientOptions, token: string): Promise<Client | false> {
	try {
		const client = new Client(config);
	
		client.on("ready", () => {
			logger.info("Client ready.");
		});

		await client.login(token);
		return client;
	} catch(error) {
		logger.error(unrollError(error, true));
		return false;
	}
}
