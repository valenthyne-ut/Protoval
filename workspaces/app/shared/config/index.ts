/*
 * This file contains a collection of functions responsible for validating
 * .env variables provided by the user, and it also exports them in the
 * appropriate runtime type.
*/

import { GatewayIntentBits, GatewayIntentsString, OAuth2Scopes } from "discord.js";
import { logger } from "../classes/Logger";
import { yellow } from "chalk";
import { ServerOptions } from "https";
import { unrollError } from "../utility/Errors";
import { readFileSync } from "fs";
import { join } from "path";

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

function getClientId(): string {
	const clientId = process.env.CLIENT_ID;
	if(clientId) { return clientId; }
	else { die("Client ID was not provided."); }
}

function getClientSecret(): string {
	const clientSecret = process.env.CLIENT_SECRET;
	if(clientSecret) { return clientSecret; }
	else { die("Client secret was not provided."); }
}

function getClientScopes(): Array<keyof typeof OAuth2Scopes> {
	const clientScopesRaw = process.env.CLIENT_SCOPES;
	if(clientScopesRaw) {
		let anyInvalidScopes = false;
		
		const validScopes = Object.keys(OAuth2Scopes);
		const userScopes = clientScopesRaw.split(", ");

		for(const scope of userScopes) {
			if(validScopes.indexOf(scope) === -1) { 
				logger.error(`Invalid scope ${yellow(scope)}.`); 
				anyInvalidScopes = true;
			}
		}

		if(anyInvalidScopes) { die("One or more invalid scopes were provided."); }
		else { return userScopes as Array<keyof typeof OAuth2Scopes>; }
	} else {
		die("Client scopes were not provided.");
	}
}

//#endregion

// #region Server getters

function getServerPort(): number {
	let serverPort = 8443;
	if(process.env.SERVER_PORT !== undefined) {
		const parsedServerPort = parseInt(process.env.SERVER_PORT);
		serverPort = parsedServerPort ? parsedServerPort : serverPort;
	}
	return serverPort;
}

function getServerCredentials(): ServerOptions {
	const credentials: ServerOptions = {};
	const cwd = process.cwd();

	try {
		const credentialsPath = join(cwd, "/ssl-credentials");
		const keyPath = join(credentialsPath, "/key.pem");
		const certPath = join(credentialsPath, "/cert.pem");

		credentials.key = readFileSync(keyPath, { encoding: "utf-8" });
		credentials.cert = readFileSync(certPath, { encoding: "utf-8" });
	} catch(error) {
		die(`Couldn't load SSL credentials.\n${unrollError(error, true)}`);
	}

	return credentials;
}

// #endregion

export default {
	CLIENT_TOKEN: getClientToken(),
	CLIENT_INTENTS: getClientIntents(),
	CLIENT_ID: getClientId(),
	CLIENT_SECRET: getClientSecret(),
	CLIENT_SCOPES: getClientScopes(),
	SERVER_PORT: getServerPort(),
	SERVER_SSL_CREDENTIALS: getServerCredentials()
};
