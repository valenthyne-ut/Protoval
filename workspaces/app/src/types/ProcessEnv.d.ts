export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SERVER_PORT: string | undefined;
			SERVER_COOKIE_SECRET: string | undefined;

			CLIENT_TOKEN: string | undefined;
			CLIENT_INTENTS: string | undefined;
		}
	}
}
