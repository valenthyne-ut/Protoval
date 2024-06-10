export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CLIENT_TOKEN: string | undefined;
			CLIENT_INTENTS: string | undefined;
		}
	}
}
