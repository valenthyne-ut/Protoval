import { Client } from "discord.js";
import config from "../config/Env";
import { Logger } from "../classes/Logger";

const logger = new Logger("Client");

export const client = new Client({
	intents: config.CLIENT_INTENTS
});

client.on("ready", client => {
	logger.info(`${client.user.tag} logged in.`);
});
