export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ENVIRONMENT: string | undefined;

			SERVER_PORT: string | undefined;
			SERVER_COOKIE_SECRET: string | undefined;

			CLIENT_TOKEN: string | undefined;
			CLIENT_INTENTS: string | undefined;
		}
	}
}
