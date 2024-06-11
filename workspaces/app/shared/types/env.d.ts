export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CLIENT_TOKEN: string | undefined;
			CLIENT_INTENTS: string | undefined;
			CLIENT_ID: string | undefined;
			CLIENT_SECRET: string | undefined;
			CLIENT_SCOPES: string | undefined;
			SERVER_PORT: string | undefined;
		}
	}
}
