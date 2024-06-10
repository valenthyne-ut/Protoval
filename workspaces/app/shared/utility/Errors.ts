export interface UnrolledError {
	message: string;
	stack?: string;
}

export function unrollError(error: unknown): UnrolledError;
export function unrollError(error: unknown, toString: true): string;
export function unrollError(error: unknown, toString?: true): UnrolledError | string {
	const unrolledError: UnrolledError = {
		message: "An unknown error has occurred."
	};

	if(error instanceof Error) {
		unrolledError.message = error.message;
		unrolledError.stack = error.stack;
	} else if(typeof error === "string") {
		unrolledError.message = error;
	}

	return toString ?
		unrolledError.message + (unrolledError.stack !== undefined ? `\n${unrolledError.stack}` : "") :
		unrolledError;
}
