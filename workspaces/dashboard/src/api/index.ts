export enum HTTPMethods {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	PATCH = "PATCH"
}

interface APICallOptionalParams {
	headers?: HeadersInit;
	body?: BodyInit;
	contentType?: string;
}

export interface APIErrorResponse {
	error?: string;
}

export abstract class GenericAPI {
	rootPath: string;
	static API_DEFAULT_ROOT_PATH: string = "/api";

	constructor(rootPath: string) {
		this.rootPath = rootPath;
	}

	protected async performCall(path: string, method: HTTPMethods, params?: APICallOptionalParams): Promise<unknown> {
		const requestOptions: RequestInit = {
			method: method,
			headers: params?.headers || {
				"Content-Type": params?.contentType || "application/json"
			},
			body: params?.body
		};
		
		const response = await fetch(path, requestOptions);

		if(response.ok) {
			return await response.json();
		} else {
			let errorText: string;

			const responseLengthHeader = response.headers.get("Content-Length");
			const responseHasContent = (responseLengthHeader != null && parseInt(responseLengthHeader) > 2);

			if(responseHasContent) {
				try {
					const responseJSON = await response.json() as APIErrorResponse;
					errorText = responseJSON.error || "API did not provide an error message.";
				} catch(_) {
					errorText = "API response is unparseable.";
				}
			} else {
				errorText = "API returned an empty response.";
			}

			throw new Error(errorText);
		}
	}
}
