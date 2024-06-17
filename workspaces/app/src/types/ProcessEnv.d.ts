export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ENVIRONMENT: string | undefined;

			SERVER_PORT: string | undefined;
			SERVER_COOKIE_SECRET: string | undefined;
			SERVER_NAME: string | undefined;

			CLIENT_TOKEN: string | undefined;
			CLIENT_INTENTS: string | undefined;
			CLIENT_ID: string | undefined;
			CLIENT_SCOPES: string | undefined;
			CLIENT_REDIRECT_URI: string | undefined;
			CLIENT_SECRET: string | undefined;
		}
	}
}
