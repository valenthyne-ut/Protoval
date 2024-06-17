import { readFileSync } from "fs";
import { ServerOptions } from "https";
import { join } from "path";
import { Logger } from "../classes/Logger";
import { unrollError } from "../util/Errors";
import { GatewayIntentBits, GatewayIntentsString } from "discord.js";
import { yellow } from "chalk";

const logger = new Logger("init");

function die(reason: string): never {
	logger.fatal(reason);
	process.exit(1);
}

// #region Server variables

function getServerPort(): number {
	let serverPort = 8443;
	if(process.env.SERVER_PORT !== undefined) {
		const parsedPort = parseInt(process.env.SERVER_PORT);
		serverPort = parsedPort || serverPort;
	}

	return serverPort;
}

function getServerCredentials(): ServerOptions {
	const credentials: ServerOptions = {};
	const cwd = process.cwd();

	try {
		const credentialsPath = join(cwd, "/ssl");
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

// #region Client variables

function getClientToken(): string {
	return process.env.CLIENT_TOKEN || die("Client token wasn't provided.");
}

function getClientIntents(): Array<GatewayIntentsString> {
	const rawClientIntents = process.env.CLIENT_INTENTS;

	if(rawClientIntents) {
		let anyInvalidIntents = false;
		
		const validIntents = Object.keys(GatewayIntentBits);
		const userIntents = rawClientIntents.split(", ");

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

// #endregion

export default {
	SERVER_PORT: getServerPort(),
	SERVER_CREDENTIALS: getServerCredentials(),

	CLIENT_TOKEN: getClientToken(),
	CLIENT_INTENTS: getClientIntents()
};
