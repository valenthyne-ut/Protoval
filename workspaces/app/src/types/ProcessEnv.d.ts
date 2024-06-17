export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SERVER_PORT: string | undefined;
			
			CLIENT_TOKEN: string | undefined;
		}
	}
}
