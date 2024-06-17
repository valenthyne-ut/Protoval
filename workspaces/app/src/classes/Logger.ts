import { ChalkFunction, bgBlack, cyanBright, green, yellow, red } from "chalk";

enum Prefixes {
	INFO = "INFO",
	WARNING = "WARNING",
	ERROR = "ERROR",
	FATAL = "FATAL"
}

export class Logger {
	private caller: string;

	constructor(caller?: string) {
		this.caller = caller || "unknown";
	}

	private static maxPrefixLength: number = (() => {
		let longestPrefixLength = 0;

		for(const prefix of Object.values(Prefixes)) {
			if(prefix.length > longestPrefixLength) { longestPrefixLength = prefix.length; }
		}

		return longestPrefixLength;
	})();

	private template(prefix: Prefixes, color: ChalkFunction, ...data: unknown[]): string {
		const currentDateTime = new Date().toISOString().replace(/[TZ]/g, " ").trimEnd();
		const output = [
			bgBlack(currentDateTime),
			color(prefix.padStart(Logger.maxPrefixLength, " ")),
			`- [ ${cyanBright(this.caller.padStart(20))} ] -`,
			data.join(" ")
		];

		return output.join(" ");
	}

	public info(...data: unknown[]) {
		console.log(this.template(Prefixes.INFO, green, data));
	}

	public warning(...data: unknown[]) {
		console.log(this.template(Prefixes.WARNING, yellow, data));
	}
	
	public error(...data: unknown[]) {
		console.log(this.template(Prefixes.ERROR, red, data));
	}

	public fatal(...data: unknown[]) {
		console.log(this.template(Prefixes.FATAL, red, data));
	}
}
