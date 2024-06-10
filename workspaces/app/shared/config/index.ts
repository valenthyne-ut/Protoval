/*
 * This file contains a collection of functions responsible for validating
 * .env variables provided by the user, and it also exports them in the
 * appropriate runtime type.
*/

import { GatewayIntentBits, GatewayIntentsString } from "discord.js";
import { logger } from "../classes/Logger";
import { yellow } from "chalk";

function die(reason: string): never {
	logger.fatal(reason);
	process.exit(1);
}

// #region Client getters

function getClientToken(): string { 
	const clientToken = process.env.CLIENT_TOKEN;
	if(clientToken) { return clientToken; }
	else { die("Client token was not provided."); }
};

function getClientIntents(): Array<GatewayIntentsString> {
	const clientIntentsRaw = process.env.CLIENT_INTENTS;
	if(clientIntentsRaw) {
		let anyInvalidIntents = false;
		
		const validIntents = Object.keys(GatewayIntentBits);
		const userIntents = clientIntentsRaw.split(", ");

		for(const intent of userIntents) {
			if(validIntents.indexOf(intent) === -1) { 
				logger.error(`Invalid intent ${yellow(intent)}.`); 
				anyInvalidIntents = true;
			}
		}

		if(anyInvalidIntents) { die("One or more invalid intents were provided."); }
		else { return userIntents as Array<GatewayIntentsString>; }
	} else {
		die("Client intents were not provided.");
	}
}

//#endregion

export default {
	CLIENT_TOKEN: getClientToken(),
	CLIENT_INTENTS: getClientIntents(),
};
